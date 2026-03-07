"use client"

import { useState } from "react"
import { FramerLanding } from "@/components/landing-templates/FramerLanding"
import { MinimalistLanding } from "@/components/landing-templates/MinimalistLanding"
import { RoyalLanding } from "@/components/landing-templates/RoyalLanding"
import { Navigation } from "@/components/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Settings2 } from "lucide-react"

export default function ClientPage() {
  const [version, setVersion] = useState<1 | 2 | 3>(1)
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false)

  return (
    <main className="relative">
      <Navigation onVersionChange={(v: number) => setVersion(v as 1 | 2 | 3)} currentVersion={version} />

      {/* Version Switcher UI - Fixed overlay for demo */}
      <div className="fixed bottom-8 left-8 z-[100]">
        <button
          onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
          className="w-14 h-14 bg-white/80 backdrop-blur-xl border border-border shadow-2xl rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all text-[#8D083B]"
          aria-label="Change style"
        >
          <Settings2 className="w-6 h-6" />
        </button>
        <AnimatePresence>
          {isSwitcherOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="absolute bottom-20 left-0 bg-white/90 backdrop-blur-2xl border border-border p-6 rounded-[2rem] shadow-2xl w-64 space-y-4"
            >
              <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 px-2">Wybierz Styl</h3>
              {[
                { id: 1, name: "Apple / Framer", desc: "Glassmorphism & Animacje" },
                { id: 2, name: "Bento Minimal", desc: "Czystość & Układ Bento" },
                { id: 3, name: "Royal / Elegant", desc: "Klasyka & Dekoracje" }
              ].map((style) => (
                <button
                  key={style.id}
                  onClick={() => {
                    setVersion(style.id as 1 | 2 | 3)
                    setIsSwitcherOpen(false)
                  }}
                  className={`w-full text-left p-4 rounded-2xl transition-all ${version === style.id
                    ? "bg-[#8D083B] text-white shadow-lg"
                    : "hover:bg-[#8D083B]/10 bg-muted/50"
                    }`}
                >
                  <div className="font-bold text-sm">{style.name}</div>
                  <div className={`text-[10px] uppercase tracking-wider opacity-60 ${version === style.id ? "text-white" : ""}`}>
                    {style.desc}
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content Rendering */}
      <AnimatePresence mode="wait">
        <motion.div
          key={version}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {version === 1 && <FramerLanding />}
          {version === 2 && <MinimalistLanding />}
          {version === 3 && <RoyalLanding />}
        </motion.div>
      </AnimatePresence>
    </main>
  )
}
