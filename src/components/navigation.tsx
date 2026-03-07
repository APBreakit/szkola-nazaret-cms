"use client"

import { Laptop, Menu, X, Sparkles, LayoutGrid, Crown } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

const versionLinks = [
  { id: 1, name: "Wersja 1", icon: Sparkles, desc: "Apple Style" },
  { id: 2, name: "Wersja 2", icon: LayoutGrid, desc: "Bento Minimal" },
  { id: 3, name: "Wersja 3", icon: Crown, desc: "Royal Style" },
]

interface NavigationProps {
  onVersionChange?: (version: number) => void
  currentVersion?: number
}

export function Navigation({ onVersionChange, currentVersion }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleVersionClick = (id: number) => {
    if (onVersionChange) {
      onVersionChange(id)
      setMobileMenuOpen(false)
    }
  }

  return (
    <nav className="sticky top-0 z-[60] bg-background/80 backdrop-blur-xl border-b border-white/20 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="hidden sm:flex w-12 h-12 rounded-full overflow-hidden items-center justify-center bg-white shadow-sm border border-border">
              <div className="text-[#8D083B] font-bold text-xl font-serif">KSP</div>
            </div>
            <div>
              <div className="font-serif text-base sm:text-lg text-foreground font-bold tracking-tight leading-none">
                Katolicka Szkoła Podstawowa
              </div>
              <div className="text-[10px] text-[#8D083B] font-black uppercase tracking-widest mt-1">im. Świętej Rodziny</div>
            </div>
          </Link>

          {/* Desktop Version Links */}
          <div className="hidden lg:flex items-center gap-1 bg-muted/30 p-1 rounded-full border border-border/50">
            {versionLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleVersionClick(link.id)}
                className={`flex items-center gap-2 px-5 py-2 text-xs font-black uppercase tracking-widest rounded-full transition-all ${currentVersion === link.id
                    ? "bg-primary text-white shadow-lg scale-105"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/50"
                  }`}
              >
                <link.icon className="w-3 h-3" />
                {link.name}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <Link href="https://portal.librus.pl/rodzina" target="_blank" className="flex items-center gap-2 px-6 py-2.5 text-xs bg-secondary text-secondary-foreground font-black uppercase tracking-widest rounded-full hover:bg-secondary/90 transition-all hover:scale-105 shadow-sm">
              <Laptop className="w-4 h-4" />
              Librus
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 hover:opacity-80 transition-opacity"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="text-primary w-6 h-6" /> : <Menu className="text-primary w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-2xl border-t border-border shadow-2xl animate-in slide-in-from-top-4 overflow-hidden rounded-b-3xl mx-4 mt-2">
            <div className="p-6 space-y-3">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-4 px-2">Wybierz wersję projektu</p>
              {versionLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleVersionClick(link.id)}
                  className={`flex items-center justify-between w-full p-4 rounded-2xl border transition-all ${currentVersion === link.id
                      ? "bg-primary text-white border-primary shadow-xl"
                      : "bg-white/50 border-border/50 text-foreground active:scale-95"
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${currentVersion === link.id ? "bg-white/20" : "bg-primary/5"}`}>
                      <link.icon className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-black uppercase tracking-widest">{link.name}</div>
                      <div className={`text-[9px] font-medium uppercase opacity-60 ${currentVersion === link.id ? "text-white" : ""}`}>{link.desc}</div>
                    </div>
                  </div>
                  {currentVersion === link.id && <div className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                </button>
              ))}

              <div className="pt-4 mt-4 border-t border-border/50">
                <Link
                  href="https://portal.librus.pl/rodzina"
                  target="_blank"
                  className="flex items-center justify-center gap-3 w-full py-5 text-secondary-foreground bg-secondary font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-secondary/20 transition-all active:scale-95"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Laptop className="w-5 h-5" />
                  E-DZIENNIK LIBRUS
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation
