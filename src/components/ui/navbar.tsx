"use client"

import { useState, useEffect } from "react"
import { Menu, X, Github, Twitter, Linkedin } from "lucide-react"

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const navLinks = [
        { name: "About", href: "#about" },
        { name: "Projects", href: "#projects" },
        { name: "Experience", href: "#experience" },
        { name: "Contact", href: "#contact" },
    ]

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? "bg-black/80 backdrop-blur-md border-b border-white/10 py-4"
                    : "bg-transparent py-6"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2 cursor-pointer group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00ff00] to-[#00aa00] flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                        <span className="text-black font-bold text-xl font-mono">S</span>
                    </div>
                    <span className="text-white font-bold text-xl tracking-tight group-hover:text-[#00ff00] transition-colors">
                        Shivansh<span className="text-[#00ff00]">.</span>
                    </span>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium text-gray-300 hover:text-[#00ff00] transition-colors relative group"
                        >
                            {link.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00ff00] transition-all duration-300 group-hover:w-full" />
                        </a>
                    ))}
                </div>

                {/* Auth Buttons & Socials */}
                <div className="hidden md:flex items-center gap-4">
                    <div className="flex items-center gap-3 pr-4 border-r border-white/10 mr-4">
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                            <Github className="w-5 h-5" />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-[#1DA1F2] transition-colors">
                            <Twitter className="w-5 h-5" />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-[#0A66C2] transition-colors">
                            <Linkedin className="w-5 h-5" />
                        </a>
                    </div>

                    <button className="text-sm font-medium text-white hover:text-[#00ff00] transition-colors px-4 py-2">
                        Log In
                    </button>
                    <button className="text-sm font-bold bg-[#00ff00] text-black px-5 py-2.5 rounded-full hover:bg-[#00cc00] hover:shadow-[0_0_20px_rgba(0,255,0,0.4)] transition-all duration-300 transform hover:-translate-y-0.5">
                        Sign Up
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-white p-2"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <div
                className={`md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-white/10 transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
            >
                <div className="p-6 flex flex-col gap-4">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-lg font-medium text-gray-300 hover:text-[#00ff00] transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {link.name}
                        </a>
                    ))}
                    <div className="h-px bg-white/10 my-2" />
                    <div className="flex flex-col gap-3">
                        <button className="text-center text-white font-medium hover:text-[#00ff00] py-2">
                            Log In
                        </button>
                        <button className="text-center font-bold bg-[#00ff00] text-black py-3 rounded-xl hover:bg-[#00cc00]">
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}
