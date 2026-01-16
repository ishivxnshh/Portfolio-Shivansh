import { startRegistration, startAuthentication } from '@simplewebauthn/browser';

// Helper to encode
const bufferToBase64 = (buffer: ArrayBuffer) =>
  btoa(String.fromCharCode(...new Uint8Array(buffer)));

interface UserProfile {
  username: string;
  credentialId: string; // Base64url encoded
  credentialPublicKey: string; // Base64url encoded (not used for verification in client-only demo, but good to store)
  counter: number;
}

const STORAGE_KEY = 'webauthn_demo_users';

export const AuthService = {
  // Get all registered users from local storage
  getUsers: (): UserProfile[] => {
    const users = localStorage.getItem(STORAGE_KEY);
    return users ? JSON.parse(users) : [];
  },

  // Save a new user
  saveUser: (user: UserProfile) => {
    const users = AuthService.getUsers();
    // Check if user exists
    if (users.find(u => u.username === user.username)) {
      throw new Error("User already exists");
    }
    users.push(user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  },

  getUser: (username: string) => {
    return AuthService.getUsers().find((u) => u.username === username);
  },

  // Mock server: Generate registration options
  async register(username: string) {
    // Check if user exists
    if (AuthService.getUser(username)) {
      throw new Error('User already exists');
    }

    // Create "fake" options usually sent from server
    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);

    // In a real app, these options come from the backend
    const options: any = {
      challenge: bufferToBase64(challenge.buffer),
      rp: {
        name: 'Portfolio Demo',
        id: window.location.hostname, // Must match current domain
      },
      user: {
        id: bufferToBase64(new TextEncoder().encode(username).buffer),
        name: username,
        displayName: username,
      },
      pubKeyCredParams: [
        { alg: -7, type: 'public-key' }, // ES256
        { alg: -257, type: 'public-key' }, // RS256
      ],
      timeout: 60000,
      attestation: 'direct', // Request attestation to verify authenticator type
      excludeCredentials: [],
      authenticatorSelection: {
        authenticatorAttachment: 'platform', // Platform authenticator (built-in)
        residentKey: 'preferred', // Prefer discoverable credentials
        requireResidentKey: false,
        userVerification: 'required', // MUST use biometric/PIN
      },
      // Extensions to hint at biometric preference
      extensions: {
        credProps: true,
      },
    };

    try {
      // Pass these directly to SimpleWebAuthn browser helper
      // Note: simplewebauthn expects JSON, but we constructed it with base64 strings where needed? 
      // Actually startRegistration expects the JSON returned from server.
      // The browser API needs buffers. simplewebauthn handles the conversion.

      const credential = await startRegistration(options);

      // "Verify" on server (mock)
      // We just store the credential ID

      const newUser: UserProfile = {
        username,
        credentialId: credential.id,
        credentialPublicKey: 'mock_public_key', // We can't easily extract this on client without parsing CBOR, skipping for demo
        counter: 0,
      };

      AuthService.saveUser(newUser);
      return newUser;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // Mock server: Generate authentication options
  async login(username: string) {
    const user = AuthService.getUser(username);
    if (!user) {
      throw new Error('User not found');
    }

    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);

    const options: any = {
      challenge: bufferToBase64(challenge.buffer),
      rpId: window.location.hostname,
      timeout: 60000,
      userVerification: 'required',
      allowCredentials: [
        {
          id: user.credentialId, // simplewebauthn handles base64 decoding if passed correctly
          type: 'public-key',
          transports: ['internal'],
        },
      ],
    };

    try {
      await startAuthentication(options);
      // "Verify" signature on server (mock)
      // If we got here, the browser successfully used the private key.
      return true;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
};
