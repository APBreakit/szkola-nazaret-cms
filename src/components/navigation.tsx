"use client"

import { Home, Newspaper, Camera, Mail, ChevronDown, GraduationCap, Building2, BookOpen, Laptop } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

const schoolLinks = [
  { name: "Historia Szkoły", slug: "historia" },
  { name: "Patron", slug: "patron" },
  { name: "Nauczyciele", slug: "nauczyciele" },
  { name: "Rada Rodziców", slug: "rada-rodzicow" },
  { name: "Samorząd Uczniowski", slug: "samorzad" },
]

const parentLinks = [
  { name: "Dokumenty szkolne", slug: "dokumenty" },
  { name: "Biblioteka", slug: "biblioteka" },
  { name: "Egzamin ósmoklasisty", slug: "egzamin" },
  { name: "Stypendia i konkursy", slug: "stypendia" },
]

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [schoolMenuOpen, setSchoolMenuOpen] = useState(false)
  const [parentMenuOpen, setParentMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/20 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="hidden sm:flex w-14 h-14 rounded-full overflow-hidden items-center justify-center bg-white shadow-sm border border-border">
              {/* Assuming there is a logo matching the red one from attachment. We will use a placeholder or local asset if missing. */}
              <div className="text-primary font-bold text-2xl font-serif">KSP</div>
            </div>
            <div>
              <div className="font-serif text-lg sm:text-xl text-foreground font-bold tracking-tight leading-none mb-1">
                Katolicka Szkoła Podstawowa
              </div>
              <div className="text-xs text-primary font-medium">im. Świętej Rodziny w Gdyni</div>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:text-primary transition-colors font-medium rounded-full hover:bg-muted"
            >
              Start
            </Link>

            <NavigationMenu viewport={false}>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:text-primary transition-colors font-medium bg-transparent hover:bg-muted rounded-full">
                    Szkoła
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[300px] gap-2 p-3 bg-card/90 backdrop-blur-xl border-white/20">
                      {schoolLinks.map((link) => (
                        <Link
                          key={link.slug}
                          href={`/${link.slug}`}
                          className="block p-3 text-sm rounded-xl hover:bg-primary/5 hover:text-primary transition-colors font-medium"
                        >
                          {link.name}
                        </Link>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:text-primary transition-colors font-medium bg-transparent hover:bg-muted rounded-full">
                    Dla ucznia i rodzica
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[300px] gap-2 p-3 bg-card/90 backdrop-blur-xl border-white/20">
                      {parentLinks.map((link) => (
                        <Link
                          key={link.slug}
                          href={`/${link.slug}`}
                          className="block p-3 text-sm rounded-xl hover:bg-primary/5 hover:text-primary transition-colors font-medium"
                        >
                          {link.name}
                        </Link>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Link
              href="/aktualnosci"
              className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:text-primary transition-colors font-medium rounded-full hover:bg-muted"
            >
              Aktualności
            </Link>

            <Link
              href="/galeria"
              className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:text-primary transition-colors font-medium rounded-full hover:bg-muted"
            >
              Galeria
            </Link>
            <Link
              href="/kontakt"
              className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:text-primary transition-colors font-medium rounded-full hover:bg-muted"
            >
              Kontakt
            </Link>
          </div>

          {/* Dziennik Action Button CTA Desktop */}
          <div className="hidden lg:block ml-4">
            <Link href="https://portal.librus.pl/rodzina" target="_blank" className="flex items-center gap-2 px-6 py-2.5 text-sm bg-secondary text-secondary-foreground font-semibold rounded-full hover:bg-secondary/90 transition-all hover:scale-105 shadow-sm">
              <Laptop className="w-4 h-4" />
              Dziennik e-Librus
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 hover:opacity-80 transition-opacity"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`w-6 h-0.5 bg-primary rounded-full transition-all duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`w-6 h-0.5 bg-primary rounded-full transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : ""}`} />
            <span className={`w-6 h-0.5 bg-primary rounded-full transition-all duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-2xl border-t border-border shadow-2xl animate-in slide-in-from-top-4">
            <div className="container mx-auto px-6 py-6 space-y-2 max-h-[80vh] overflow-y-auto">
              <Link href="/" className="block py-3 text-lg font-medium text-foreground hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
                Start
              </Link>

              <div>
                <button onClick={() => setSchoolMenuOpen(!schoolMenuOpen)} className="flex items-center justify-between w-full py-3 text-lg font-medium text-foreground hover:text-primary">
                  Szkoła
                  <ChevronDown className={`w-5 h-5 transition-transform ${schoolMenuOpen ? "rotate-180" : ""}`} />
                </button>
                {schoolMenuOpen && (
                  <div className="pl-4 py-2 border-l border-border/50 ml-2 space-y-2">
                    {schoolLinks.map((link) => (
                      <Link key={link.slug} href={`/${link.slug}`} className="block py-2 text-muted-foreground hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
                        {link.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <button onClick={() => setParentMenuOpen(!parentMenuOpen)} className="flex items-center justify-between w-full py-3 text-lg font-medium text-foreground hover:text-primary">
                  Dla ucznia i rodzica
                  <ChevronDown className={`w-5 h-5 transition-transform ${parentMenuOpen ? "rotate-180" : ""}`} />
                </button>
                {parentMenuOpen && (
                  <div className="pl-4 py-2 border-l border-border/50 ml-2 space-y-2">
                    {parentLinks.map((link) => (
                      <Link key={link.slug} href={`/${link.slug}`} className="block py-2 text-muted-foreground hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
                        {link.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link href="/aktualnosci" className="block py-3 text-lg font-medium text-foreground hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
                Aktualności
              </Link>
              <Link href="/galeria" className="block py-3 text-lg font-medium text-foreground hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
                Galeria
              </Link>
              <Link href="/kontakt" className="block py-3 text-lg font-medium text-foreground hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
                Kontakt
              </Link>

              <div className="pt-6 pb-2">
                <Link href="https://portal.librus.pl/rodzina" className="flex items-center justify-center gap-2 w-full py-4 text-secondary-foreground bg-secondary font-semibold rounded-full hover:opacity-90">
                  <Laptop className="w-5 h-5" />
                  Dziennik elektroniczny
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
