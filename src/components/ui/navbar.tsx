"use client"

import { useState, useEffect } from "react"
import { Menu, X, Github, Twitter, Linkedin, Mail, LogOut, User as UserIcon } from "lucide-react"
import AuthModal from "@/components/auth-modal"

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [activeSection, setActiveSection] = useState("")

    // Auth state
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
    const [currentUser, setCurrentUser] = useState<string | null>(null)

    useEffect(() => {
        // Check local storage for session (optional, for demo persistence)
        const savedUser = localStorage.getItem('demo_current_user')
        if (savedUser) setCurrentUser(savedUser)

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)

            // Track active section
            const sections = ["about", "projects", "experience", "contact"]
            const scrollPosition = window.scrollY + 100

            for (const section of sections) {
                const element = document.getElementById(section)
                if (element) {
                    const offsetTop = element.offsetTop
                    const offsetHeight = element.offsetHeight
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveSection(section)
                        break
                    }
                }
            }
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const handleLoginSuccess = (username: string) => {
        setCurrentUser(username)
        localStorage.setItem('demo_current_user', username)
    }

    const handleLogout = () => {
        setCurrentUser(null)
        localStorage.removeItem('demo_current_user')
    }

    const navLinks = [
        { name: "About", href: "#about" },
        { name: "Projects", href: "#projects" },
        { name: "Experience", href: "#experience" },
        { name: "Contact", href: "#contact" },
    ]

    const socialLinks = [
        {
            name: "GitHub",
            href: "https://github.com/ishivxnshh",
            icon: Github,
            hoverColor: "hover:text-white",
            tooltip: "View my GitHub"
        },
        {
            name: "Twitter",
            href: "https://twitter.com/ishivxnshh",
            icon: Twitter,
            hoverColor: "hover:text-[#1DA1F2]",
            tooltip: "Follow on Twitter"
        },
        {
            name: "LinkedIn",
            href: "https://linkedin.com/in/ishivxnshh",
            icon: Linkedin,
            hoverColor: "hover:text-[#0A66C2]",
            tooltip: "Connect on LinkedIn"
        },
    ]

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault()
        const element = document.querySelector(href)
        if (element) {
            const offset = 80
            const elementPosition = element.getBoundingClientRect().top
            const offsetPosition = elementPosition + window.pageYOffset - offset

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            })
        }
        setIsMobileMenuOpen(false)
    }

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                    ? "bg-black/70 backdrop-blur-xl border-b border-white/10 py-3 shadow-[0_8px_32px_0_rgba(0,255,0,0.1)]"
                    : "bg-gradient-to-b from-black/50 to-transparent backdrop-blur-sm py-5"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    {/* Logo */}
                    <a
                        href="#"
                        className="flex items-center gap-2 cursor-pointer group relative"
                        onClick={(e) => {
                            e.preventDefault()
                            window.scrollTo({ top: 0, behavior: "smooth" })
                        }}
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#00ff00] to-[#00aa00] rounded-xl blur-md opacity-0 group-hover:opacity-70 transition-opacity duration-300" />
                            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-[#00ff00] via-[#00dd00] to-[#00aa00] flex items-center justify-center transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 shadow-lg">
                                <span className="text-black font-bold text-xl font-mono">S</span>
                            </div>
                        </div>
                        <span className="text-white font-bold text-xl tracking-tight group-hover:text-[#00ff00] transition-all duration-300">
                            Shivansh<span className="text-[#00ff00] animate-pulse">.</span>
                        </span>
                    </a>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => {
                            const isActive = activeSection === link.href.substring(1)
                            return (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={(e) => handleNavClick(e, link.href)}
                                    className={`relative text-sm font-medium px-4 py-2 rounded-lg transition-all duration-300 group ${isActive
                                        ? "text-[#00ff00]"
                                        : "text-gray-300 hover:text-white"
                                        }`}
                                >
                                    <span className="relative z-10">{link.name}</span>
                                    {isActive && (
                                        <span className="absolute inset-0 bg-[#00ff00]/10 rounded-lg border border-[#00ff00]/30" />
                                    )}
                                    <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-transparent via-[#00ff00] to-transparent transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"
                                        }`} />
                                </a>
                            )
                        })}
                    </div>

                    {/* Auth Buttons & Socials */}
                    <div className="hidden md:flex items-center gap-4">
                        <div className="flex items-center gap-2 pr-4 border-r border-white/10">
                            {socialLinks.map((social) => {
                                const Icon = social.icon
                                return (
                                    <a
                                        key={social.name}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`relative group text-gray-400 ${social.hoverColor} transition-all duration-300 p-2 rounded-lg hover:bg-white/5`}
                                        aria-label={social.name}
                                    >
                                        <Icon className="w-5 h-5 transform group-hover:scale-110 transition-transform duration-300" />
                                        {/* Tooltip */}
                                        <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/90 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                                            {social.tooltip}
                                        </span>
                                    </a>
                                )
                            })}
                        </div>

                        {currentUser ? (
                            <div className="flex items-center gap-3 animate-in fade-in zoom-in duration-300">
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                                    <UserIcon className="w-4 h-4 text-[#00ff00]" />
                                    <span className="text-sm font-medium text-white">{currentUser}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                    title="Logout"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <>
                                <button
                                    onClick={() => setIsAuthModalOpen(true)}
                                    className="relative text-sm font-medium text-white hover:text-[#00ff00] transition-all duration-300 px-4 py-2 rounded-lg hover:bg-white/5 group overflow-hidden"
                                >
                                    <span className="relative z-10">Log In</span>
                                </button>
                                <button
                                    onClick={() => setIsAuthModalOpen(true)}
                                    className="relative text-sm font-bold bg-gradient-to-r from-[#00ff00] to-[#00cc00] text-black px-6 py-2.5 rounded-full hover:shadow-[0_0_30px_rgba(0,255,0,0.5)] transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105 overflow-hidden group"
                                >
                                    <span className="absolute inset-0 bg-gradient-to-r from-[#00cc00] to-[#00ff00] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <span className="relative z-10 flex items-center gap-2">
                                        Sign Up
                                        <Mail className="w-4 h-4" />
                                    </span>
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors duration-300"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <div className="relative w-6 h-6">
                            <Menu
                                className={`absolute inset-0 transition-all duration-300 ${isMobileMenuOpen ? "opacity-0 rotate-90" : "opacity-100 rotate-0"
                                    }`}
                            />
                            <X
                                className={`absolute inset-0 transition-all duration-300 ${isMobileMenuOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
                                    }`}
                            />
                        </div>
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                <div
                    className={`md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-2xl border-b border-white/10 transition-all duration-500 overflow-hidden ${isMobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                        }`}
                >
                    <div className="p-6 flex flex-col gap-2">
                        {navLinks.map((link, index) => {
                            const isActive = activeSection === link.href.substring(1)
                            return (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={(e) => handleNavClick(e, link.href)}
                                    className={`text-lg font-medium transition-all duration-300 p-3 rounded-lg ${isActive
                                        ? "text-[#00ff00] bg-[#00ff00]/10 border border-[#00ff00]/30"
                                        : "text-gray-300 hover:text-[#00ff00] hover:bg-white/5"
                                        }`}
                                    style={{
                                        transitionDelay: `${index * 50}ms`
                                    }}
                                >
                                    {link.name}
                                </a>
                            )
                        })}

                        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-3" />

                        {/* Mobile Social Links */}
                        <div className="flex items-center justify-center gap-4 mb-3">
                            {socialLinks.map((social) => {
                                const Icon = social.icon
                                return (
                                    <a
                                        key={social.name}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`text-gray-400 ${social.hoverColor} transition-all duration-300 p-2 rounded-lg hover:bg-white/5`}
                                        aria-label={social.name}
                                    >
                                        <Icon className="w-6 h-6" />
                                    </a>
                                )
                            })}
                        </div>

                        <div className="flex flex-col gap-3">
                            {currentUser ? (
                                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                                    <div className="flex items-center gap-2">
                                        <UserIcon className="w-5 h-5 text-[#00ff00]" />
                                        <span className="text-white font-medium">{currentUser}</span>
                                    </div>
                                    <button
                                        onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                                        className="text-red-400 text-sm font-medium"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <button
                                        onClick={() => { setIsAuthModalOpen(true); setIsMobileMenuOpen(false); }}
                                        className="text-center text-white font-medium hover:text-[#00ff00] py-3 rounded-xl border border-white/10 hover:border-[#00ff00]/30 hover:bg-white/5 transition-all duration-300"
                                    >
                                        Log In
                                    </button>
                                    <button
                                        onClick={() => { setIsAuthModalOpen(true); setIsMobileMenuOpen(false); }}
                                        className="text-center font-bold bg-gradient-to-r from-[#00ff00] to-[#00cc00] text-black py-3 rounded-xl hover:shadow-[0_0_20px_rgba(0,255,0,0.4)] transition-all duration-300 transform hover:scale-105"
                                    >
                                        Sign Up
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onLoginSuccess={handleLoginSuccess}
            />
        </>
    )
}

