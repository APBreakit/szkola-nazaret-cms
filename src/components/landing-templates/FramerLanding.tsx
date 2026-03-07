"use client"

import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { schoolData } from "@/lib/school-data"
import {
    GraduationCap,
    MapPin,
    Mail,
    Phone,
    ChevronRight,
    Star,
    Quote,
    ArrowRight,
    Sparkles,
    Zap,
    Palette,
    Heart,
    Box,
    Cpu,
    Globe
} from "lucide-react"
import { useRef } from "react"

const fadeInUp: any = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1] } }
}

const stagger = {
    visible: { transition: { staggerChildren: 0.1 } }
}

export function FramerLanding() {
    const containerRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    })

    // Throttled and smoothed transforms to prevent flickering
    const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])
    const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.9])
    const heroY = useTransform(scrollYProgress, [0, 0.15], [0, -50])

    const springScale = useSpring(heroScale, { stiffness: 100, damping: 30 })

    return (
        <div ref={containerRef} className="min-h-screen bg-[#FDFCFB] text-[#1D1D1F] selection:bg-[#47A5E2]/30 overflow-x-hidden font-sans antialiased">
            {/* Optimized Background Ambient Effects - Using will-change to prevent flicker */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden perspective-[1000px]">
                <motion.div
                    style={{ willChange: "transform, opacity" }}
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.1, 0.15, 0.1],
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-10%] left-[-5%] w-[50vw] h-[50vw] rounded-full bg-[#8D083B] blur-[140px] transform-gpu translate-z-0"
                />
                <motion.div
                    style={{ willChange: "transform, opacity" }}
                    animate={{
                        scale: [1.1, 1, 1.1],
                        opacity: [0.08, 0.12, 0.08],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[5%] right-[-5%] w-[60vw] h-[60vw] rounded-full bg-[#47A5E2] blur-[160px] transform-gpu translate-z-0"
                />
            </div>

            {/* Hero Section */}
            <section id="start" className="relative h-screen flex items-center justify-center px-6 text-center scroll-mt-20 overflow-hidden">
                <motion.div
                    style={{ opacity: heroOpacity, scale: springScale, y: heroY }}
                    initial="hidden"
                    animate="visible"
                    variants={stagger}
                    className="relative z-10 space-y-10 max-w-5xl mx-auto"
                >
                    <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/50 backdrop-blur-md border border-slate-200 shadow-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8D083B] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8D083B]"></span>
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground italic">Innovation in Education</span>
                    </motion.div>

                    <motion.h1
                        variants={fadeInUp}
                        className="text-7xl md:text-[8.5rem] font-serif font-black tracking-tight leading-[0.85] text-foreground"
                    >
                        Design <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8D083B] via-[#2D3B59] to-[#47A5E2] animate-gradient">Future.</span>
                    </motion.h1>

                    <motion.p
                        variants={fadeInUp}
                        className="text-xl md:text-3xl text-muted-foreground/80 font-medium max-w-3xl mx-auto leading-tight"
                    >
                        {schoolData.motto}. Tworzymy standardy, których inni szukają.
                    </motion.p>

                    <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-6 pt-12">
                        <button className="px-14 py-7 bg-[#1D1D1F] text-white rounded-[2.5rem] font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-2xl hover:shadow-[#1D1D1F]/20">
                            Aplikuj Teraz
                        </button>
                        <button className="px-14 py-7 bg-white border border-slate-200 rounded-[2.5rem] font-black uppercase tracking-widest text-xs hover:bg-slate-50 transition-colors shadow-lg">
                            Nasze MVP
                        </button>
                    </motion.div>
                </motion.div>
            </section>

            {/* NEW: Innovation Hub (AI Automate & MVP 3D Elements) */}
            <section className="py-48 px-6 container mx-auto perspective-[2000px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* MVP 3D Card */}
                    <motion.div
                        initial={{ opacity: 0, rotateX: 20, y: 100 }}
                        whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        className="group relative h-[600px] rounded-[4rem] bg-gradient-to-br from-white to-slate-50 border border-slate-200 shadow-2xl overflow-hidden p-16 flex flex-col justify-between transform-gpu hover:shadow-[0_50px_100px_rgba(0,0,0,0.1)] transition-shadow"
                    >
                        <div className="absolute top-0 right-0 p-12 opacity-5 translate-x-10 -translate-y-10 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-1000">
                            <Box className="w-64 h-64" />
                        </div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 rounded-3xl bg-[#8D083B]/5 flex items-center justify-center text-[#8D083B] mb-8">
                                <Box className="w-8 h-8" />
                            </div>
                            <h3 className="text-5xl font-black tracking-tighter mb-6 uppercase">Program <br /><span className="text-[#8D083B]">MVP</span></h3>
                            <p className="text-xl text-muted-foreground leading-relaxed max-w-xs font-medium">Realizujemy Minimum Viable Projects - autorskie inicjatywy uczniów, które zmieniają otoczenie szkoły.</p>
                        </div>
                        <div className="relative z-10 flex justify-between items-end border-t border-slate-100 pt-12">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-[#8D083B]">Status Programu</p>
                                <p className="text-2xl font-bold">Aktywny</p>
                            </div>
                            <div className="w-16 h-16 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-[#8D083B] group-hover:text-white transition-all">
                                <ArrowRight className="w-6 h-6" />
                            </div>
                        </div>
                        {/* "Oddal lekko w tył" - 3D layering */}
                        <div className="absolute inset-0 bg-slate-900/5 -z-10 group-hover:scale-110 transition-transform duration-1000" />
                    </motion.div>

                    {/* AI Automate 3D Card */}
                    <motion.div
                        initial={{ opacity: 0, rotateX: 20, y: 150 }}
                        whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="group relative h-[600px] rounded-[4rem] bg-[#1D1D1F] border border-white/5 shadow-2xl overflow-hidden p-16 flex flex-col justify-between transform-gpu"
                    >
                        <div className="absolute top-0 right-0 p-12 opacity-5 translate-x-10 -translate-y-10 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-1000">
                            <Cpu className="w-64 h-64 text-white" />
                        </div>
                        <div className="relative z-10 text-white">
                            <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center text-[#47A5E2] mb-8">
                                <Cpu className="w-8 h-8" />
                            </div>
                            <h3 className="text-5xl font-black tracking-tighter mb-6 uppercase">AI <br /><span className="text-[#47A5E2]">Automate</span></h3>
                            <p className="text-xl opacity-50 leading-relaxed max-w-xs font-medium">Automatyzacja procesów nauczania. Wykorzystujemy LLM do personalizacji ścieżek edukacyjnych.</p>
                        </div>
                        <div className="relative z-10 flex justify-between items-end border-t border-white/10 pt-12 text-white">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-[#47A5E2]">Zaawansowanie</p>
                                <p className="text-2xl font-bold italic">Deep Tech</p>
                            </div>
                            <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-[#47A5E2] group-hover:text-white transition-all">
                                <Zap className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-br from-[#47A5E2]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    </motion.div>
                </div>
            </section>

            {/* Bento Grid Story - Optimized */}
            <section id="o-nas" className="py-24 px-6 container mx-auto scroll-mt-20">
                <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-3 gap-8 h-full md:min-h-[1000px]">
                    <motion.div
                        whileHover={{ y: -10 }}
                        className="md:col-span-2 md:row-span-2 rounded-[3.5rem] bg-white border border-slate-200 relative overflow-hidden group p-16 shadow-xl flex flex-col justify-between"
                    >
                        <div className="relative z-20">
                            <div className="space-y-6">
                                <div className="px-5 py-2 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-black uppercase tracking-widest w-fit">Dziedzictwo</div>
                                <h3 className="text-5xl md:text-6xl font-serif font-black tracking-tight leading-none text-foreground">Standard <br /> Nazaretu.</h3>
                            </div>
                            <p className="text-xl text-muted-foreground mt-12 leading-relaxed max-w-sm font-medium">{schoolData.history.description}</p>
                        </div>
                        <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200" className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-10 transition-opacity duration-1000 -z-10" alt="Education" />
                    </motion.div>

                    <div className="bg-[#8D083B] rounded-[3.5rem] p-12 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-20 transform group-hover:rotate-12 transition-transform">
                            <GraduationCap className="w-24 h-24" />
                        </div>
                        <GraduationCap className="w-14 h-14" />
                        <div>
                            <h4 className="text-2xl font-black mb-3 uppercase tracking-tighter leading-none italic opacity-60">Fundament</h4>
                            <p className="text-lg font-bold leading-tight">{schoolData.history.patron}</p>
                        </div>
                    </div>

                    <div className="bg-[#47A5E2] rounded-[3.5rem] p-12 text-white flex flex-col justify-between shadow-2xl group relative overflow-hidden">
                        <Star className="w-14 h-14" />
                        <div>
                            <h4 className="text-2xl font-black mb-3 uppercase tracking-tighter leading-none italic opacity-60">Tradycja</h4>
                            <p className="text-lg font-bold leading-tight">23 lata bezkompromisowej jakości.</p>
                        </div>
                    </div>

                    <div className="md:col-span-2 bg-[#1D1D1F] rounded-[3.5rem] p-16 text-white relative overflow-hidden group shadow-2xl">
                        <div className="flex justify-between items-center relative z-10 h-full">
                            <div className="space-y-4">
                                <h3 className="text-4xl md:text-5xl font-black">Elite Hub</h3>
                                <p className="text-lg opacity-40 font-medium">Budujemy społeczność liderów Jutra.</p>
                            </div>
                            <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#8D083B] transition-colors cursor-pointer group-hover:scale-110">
                                <Globe className="w-10 h-10 text-[#47A5E2]" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Floating Activities - Detail Focus */}
            <section id="oferta" className="py-48 bg-[#FDFCFB] border-t border-slate-100 scroll-mt-20">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-32 gap-12 border-b border-slate-100 pb-20">
                        <div className="max-w-3xl space-y-8">
                            <div className="w-12 h-px bg-[#8D083B]" />
                            <h2 className="text-6xl md:text-9xl font-serif font-black tracking-tighter leading-[0.8] text-foreground italic">Beyond <br /><span className="not-italic text-[#8D083B]">Standard.</span></h2>
                            <p className="text-2xl text-muted-foreground/70 font-medium max-w-xl">Prowadzimy koła zainteresowań, które wykraczają poza horyzont tradycyjnej nauki.</p>
                        </div>
                        <button className="flex items-center gap-4 px-12 py-6 bg-[#2D3B59] text-white rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-[#1D1D1F] transition-all group">
                            Odkryj Pełen Katalog <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                        {[
                            { title: "Naukowe / AI", list: schoolData.activities.scientific, icon: Zap, themeColor: "#47A5E2" },
                            { title: "Sztuka / Design", list: schoolData.activities.artistic, icon: Palette, themeColor: "#8D083B" },
                            { title: "Sport / Action", list: schoolData.activities.sport, icon: Heart, themeColor: "#2D3B59" }
                        ].map((cat, i) => (
                            <div key={i} className="group relative">
                                <div className="flex items-center gap-6 mb-12">
                                    <div className="w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-2xl transition-all group-hover:scale-110 group-hover:rotate-6"
                                        style={{ backgroundColor: `${cat.themeColor}15`, color: cat.themeColor }}>
                                        <cat.icon className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-3xl font-black uppercase tracking-tighter">{cat.title}</h3>
                                </div>
                                <ul className="space-y-8">
                                    {cat.list.slice(0, 5).map((item, j) => (
                                        <li key={j} className="flex justify-between items-center group/li py-4 border-b border-slate-50 hover:border-slate-300 transition-all cursor-crosshair">
                                            <span className="text-2xl font-bold text-muted-foreground group-hover/li:text-black transition-colors">{item}</span>
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center opacity-0 group-hover/li:opacity-100 transition-opacity">
                                                <Star className="w-3 h-3 text-[#B8860B]" />
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Faculty - High End Cards */}
            <section className="py-48 bg-[#1D1D1F] text-white">
                <div className="container mx-auto px-6">
                    <div className="flex items-center gap-8 mb-24 overflow-hidden grayscale opacity-20">
                        <div className="text-[120px] font-black select-none whitespace-nowrap animate-scroll-left">KADRA • PEDAGOGY • MISTRZOSTWO • ELITA • </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {schoolData.staff.map((member, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="p-16 rounded-[4rem] bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all group cursor-default"
                            >
                                <div className="relative mb-12">
                                    <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-tr from-[#8D083B] to-[#47A5E2] flex items-center justify-center font-serif text-5xl font-black text-white shadow-3xl group-hover:scale-105 transition-transform duration-500">
                                        {member.name[0]}
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-white flex items-center justify-center text-black">
                                        <Quote className="w-5 h-5" />
                                    </div>
                                </div>
                                <h4 className="text-3xl font-black mb-2 tracking-tighter uppercase">{member.name}</h4>
                                <p className="text-[#47A5E2] font-black uppercase text-[10px] tracking-[0.3em]">{member.subject}</p>
                                <p className="mt-8 text-white/40 italic font-medium">"Wiedza to fundament, ale charakter to architekt."</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final Contact CTA */}
            <section id="kontakt" className="py-48 px-6 container mx-auto scroll-mt-20">
                <motion.div
                    className="rounded-[5rem] bg-gradient-to-br from-[#8D083B]/10 via-white to-[#47A5E2]/10 p-16 md:p-32 border border-slate-200 text-center shadow-3xl relative overflow-hidden"
                >
                    <div className="relative z-10 space-y-16">
                        <h2 className="text-6xl md:text-[8rem] font-serif font-black mb-16 tracking-tighter leading-[0.9] text-[#1D1D1F]">Zbudujmy <br /><span className="text-[#8D083B]">Wartość.</span></h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                            <div className="flex items-center gap-8 p-10 rounded-[3rem] bg-white border border-slate-100 group cursor-pointer hover:shadow-2xl transition-all">
                                <div className="w-20 h-20 rounded-full bg-[#8D083B] text-white flex items-center justify-center group-hover:rotate-12 transition-transform">
                                    <Phone className="w-8 h-8" />
                                </div>
                                <div className="text-left space-y-1">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic leading-none">Sekretariat Główny</p>
                                    <p className="text-3xl font-black tracking-tighter text-[#1D1D1F]">{schoolData.contact.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-8 p-10 rounded-[3rem] bg-white border border-slate-100 group cursor-pointer hover:shadow-2xl transition-all">
                                <div className="w-20 h-20 rounded-full bg-[#2D3B59] text-white flex items-center justify-center group-hover:-rotate-12 transition-transform">
                                    <Mail className="w-8 h-8" />
                                </div>
                                <div className="text-left space-y-1">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic leading-none">Poczta Elektroniczna</p>
                                    <p className="text-2xl font-black tracking-tighter text-[#1D1D1F] truncate">{schoolData.contact.email}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center gap-12 opacity-30 pt-12">
                            <p className="text-[10px] font-black uppercase tracking-[0.5em] italic">Gdynia • Tetmajera • Nazaret</p>
                        </div>
                    </div>
                </motion.div>
            </section>

            <footer className="py-20 border-t border-slate-100 opacity-40 hover:opacity-100 transition-opacity">
                <div className="container mx-auto px-6 text-center">
                    <p className="text-xs font-black uppercase tracking-[0.4em] mb-4">© 2026 Katolicka Szkoła Podstawowa w Gdyni</p>
                    <div className="flex justify-center gap-12 text-[9px] font-black uppercase tracking-widest">
                        <a href="#" className="hover:text-[#8D083B]">Polityka prywatności</a>
                        <a href="#" className="hover:text-[#8D083B]">RODO</a>
                        <a href="#" className="hover:text-[#8D083B]">BIP</a>
                    </div>
                </div>
            </footer>
        </div>
    )
}
