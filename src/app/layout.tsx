import type React from "react"
import type { Metadata } from "next"
import { Nunito } from "next/font/google"
import { Suspense } from "react"
import "./globals.css"
import CookieConsentManager from "@/components/cookie-consent-manager"
import ScrollToTop from "@/components/scroll-to-top"
import AccessibilityWidget from "@/components/accessibility-widget" // Import the AccessibilityWidget component
import AuthProvider from "@/components/auth-provider"

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
  weight: ["300", "400", "600", "700", "800"],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://szkołanazaret.pl"),
  title: {
    default: "Katolicka Szkoła Podstawowa im. Świętej Rodziny - Szkoła Nazaret",
    template: "%s | Katolicka Szkoła Podstawowa Nazaret Gdynia",
  },
  description:
    "Katolicka Szkoła Podstawowa parafialne przy Parafii NMP w Gdyni. Oferujemy ciepłą, rodzinną atmosferę, wszechstronny rozwój uczniów oraz edukację katolicką. Ponad 34 lata doświadczenia. Zapisz swoje ucznia już dziś!",
  keywords: [
    "szkoła Gdynia",
    "szkoła parafialne",
    "szkoła Nazaret",
    "szkoła katolickie",
    "edukacja przedszkolna Gdynia",
    "rekrutacja szkoła",
    "szkoła Świętej Rodziny",
  ],
  authors: [{ name: "Katolicka Szkoła Podstawowa im. Świętej Rodziny" }],
  creator: "Katolicka Szkoła Podstawowa im. Świętej Rodziny",
  publisher: "Katolicka Szkoła Podstawowa im. Świętej Rodziny",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Katolicka Szkoła Podstawowa im. Świętej Rodziny - Szkoła Nazaret",
    description:
      "Katolicka Szkoła Podstawowa parafialne przy Parafii NMP w Gdyni. 34 lata doświadczenia w wychowaniu i edukacji uczniów w duchu wartości chrześcijańskich.",
    url: "https://szkołanazaret.pl",
    siteName: "Katolicka Szkoła Podstawowa Nazaret",
    locale: "pl_PL",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Katolicka Szkoła Podstawowa im. Świętej Rodziny - Szkoła Nazaret",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Katolicka Szkoła Podstawowa im. Świętej Rodziny - Szkoła Nazaret",
    description: "Katolicka Szkoła Podstawowa parafialne przy Parafii NMP w Gdyni. 34 lata doświadczenia w wychowaniu uczniów.",
    images: ["/images/og-image.jpg"],
  },
  icons: {
    icon: "/logo-szkoła.jpg",
    shortcut: "/logo-szkoła.jpg",
    apple: "/logo-szkoła.jpg",
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  verification: {
    google: "verification_token",
  },
  generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://hebbkx1anhila5yf.public.blob.vercel-storage.com" />
        <link rel="dns-prefetch" href="https://vercel.live" />
      </head>
      <body className={`${nunito.variable} font-sans antialiased`}>
        <AuthProvider>
          <ScrollToTop />
          <Suspense fallback={null}>{children}</Suspense>
          <AccessibilityWidget />
          <CookieConsentManager
            brandName="Katolicka Szkoła Podstawowa Nazaret"
            policyLinks={{
              privacy: "/polityka-prywatnosci",
              cookies: "/polityka-cookie",
            }}
            forceLang="pl"
          />
        </AuthProvider>
      </body>
    </html>
  )
}
