import Link from "next/link"
import { MapPin, Phone, Mail, Facebook, Info, Users, ImageIcon, FileText, Newspaper, Shield, Cookie, Lock, GraduationCap } from 'lucide-react'
import Image from "next/image"

export function Footer() {
  return (
    <footer className="border-t border-border pt-16 pb-8 space-y-12 opacity-0 animate-fade-in animation-delay-200">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 py-2.5">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden">
                <Image src="/logoduze-2.jpg" alt="Katolicka Szkoła Podstawowa Logo" width={48} height={48} className="object-contain" />
              </div>
              <div>
                <div className="font-serif text-xl text-foreground font-bold">Katolicka Szkoła Podstawowa im. Świętej Rodziny</div>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Katolicka Szkoła Podstawowa im. Świętej Rodziny przy Parafii NMP w Gdyni
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/profile.php?id=100076215102933"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full gradient-1 flex items-center justify-center transition-all hover:scale-110"
              >
                <Facebook className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Menu */}
          <div className="space-y-6">
            <h4 className="font-semibold text-foreground text-lg">Menu</h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Home className="w-4 h-4" />Strona Główna
                </Link>
              </li>
            </ul>
          </div>

          {/* Documents Placeholder or Quick Info */}
          <div className="space-y-6">
            <h4 className="font-semibold text-foreground text-lg">Ważne</h4>
            <ul className="space-y-4">
              <li className="text-muted-foreground text-sm leading-relaxed">
                Zajrzyj do nas, aby poznać wartości, którymi kierujemy się w edukacji naszych uczniów.
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="font-semibold text-foreground text-lg">Kontakt</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-muted-foreground text-sm space-y-1">
                  <a href="tel:586221199" className="block hover:text-primary transition-colors">
                    (58) 622 11 99
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-muted-foreground text-sm space-y-1">
                  <a href="mailto:sekretariat@kspgdynia.pl" className="block hover:text-primary transition-colors">
                    sekretariat@kspgdynia.pl
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <a
                  href="https://maps.google.com/?q=Świętojańska+1,81-368+Gdynia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground text-sm hover:text-primary transition-colors"
                >
                  ul. Świętojańska 1, 81-368 Gdynia
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 pt-2.5">
          <p className="text-muted-foreground text-sm">
            © 2026 Katolicka Szkoła Podstawowa im. Świętej Rodziny.
          </p>
          <div className="flex gap-6 text-sm">
            {/* Keeping policy links as they are usually required or point to external/static docs */}
            <span className="text-muted-foreground">Publiczna placówka oświatowa</span>
          </div>
        </div>

        <div className="pt-6 flex justify-center">
          <a
            href="https://breackly.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm group"
          >
            <span>Love design?</span>
            <Image
              src="https://jm0ga6nxrnhmufnu.public.blob.vercel-storage.com/breackly-logo-nCxX8jIIZaIJBKpe85BzHhWNLIvIzb.png"
              alt="Breackly Logo"
              width={20}
              height={20}
              className="transition-transform group-hover:scale-110"
            />
            <span className="font-medium">Be Breackly</span>
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
