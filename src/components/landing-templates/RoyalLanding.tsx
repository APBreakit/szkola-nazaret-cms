"use client"

import { schoolData } from "@/lib/school-data"
import { motion, useScroll, useTransform } from "framer-motion"
import { ShieldCheck, Cross, Star, Crown, Anchor, PhoneCall, ScrollText, Landmark, PartyPopper, HeartHandshake, History, Box, Cpu } from "lucide-react"
import { useRef } from "react"

export function RoyalLanding() {
    const containerRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    })

    // Fixed header effect
    const headerOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0.8])

    return (
        <div ref={containerRef} className="min-h-screen bg-[#FBF7F2] text-[#2C1810] font-serif selection:bg-[#B8860B]/20 overflow-x-hidden antialiased perspective-[1000px]">
            {/* Decorative Fixed Framework - Using transform-gpu to prevent flickering */}
            <div className="fixed inset-6 border-[1px] border-[#B8860B]/10 pointer-events-none z-[70] rounded-sm transform-gpu will-change-transform" />
            <div className="fixed inset-8 border-[2px] border-[#B8860B]/5 pointer-events-none z-[70] rounded-sm transform-gpu will-change-transform" />

            {/* Hero Section - Majestic & Deep */}
            <section id="start" className="relative pt-64 pb-56 px-8 container mx-auto text-center scroll-mt-20 overflow-hidden">
                {/* Background Crest */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.04] -z-10 pointer-events-none select-none">
                    <Landmark className="w-[900px] h-[900px]" />
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                    className="mb-20 flex justify-center"
                >
                    <div className="relative group">
                        <div className="absolute inset-[-40px] bg-[#B8860B]/10 blur-[100px] rounded-full group-hover:blur-[120px] transition-all duration-1000 transform-gpu" />
                        <img src={schoolData.logo} alt="Emblem" className="w-48 h-48 relative z-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)] group-hover:scale-105 transition-transform duration-1000" />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center gap-12 mb-16"
                >
                    <div className="h-px w-32 bg-gradient-to-r from-transparent via-[#B8860B]/30 to-transparent" />
                    <p className="text-[#B8860B] font-bold uppercase tracking-[0.8em] text-[10px] italic">Traditio et Progressio</p>
                    <div className="h-px w-32 bg-gradient-to-l from-transparent via-[#B8860B]/30 to-transparent" />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-7xl md:text-[9.5rem] font-bold mb-20 tracking-tight text-[#3E2723] leading-[0.8] font-serif"
                >
                    {schoolData.name}
                </motion.h1>

                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 2, delay: 0.5 }}
                    className="w-80 h-[1px] bg-gradient-to-r from-transparent via-[#B8860B] to-transparent mx-auto relative mb-16"
                >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-[#FBF7F2] flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rotate-45 bg-[#B8860B]" />
                    </div>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-4xl italic font-light max-w-4xl mx-auto leading-relaxed text-[#5D4037] font-serif tracking-tight"
                >
                    &bdquo;{schoolData.motto}&ldquo;
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="mt-24 flex justify-center gap-12"
                >
                    <button className="px-20 py-7 bg-[#2C1810] text-[#FBF7F2] font-black uppercase tracking-[0.4em] text-[11px] hover:bg-[#3E2723] transition-all shadow-[0_30px_60px_rgba(0,0,0,0.2)] rounded-sm">
                        Rekrutacja 2026
                    </button>
                    <button className="px-14 py-7 border border-[#B8860B]/40 text-[#2C1810] font-black uppercase tracking-[0.4em] text-[11px] hover:bg-[#B8860B]/5 transition-all rounded-sm">
                        E-Dziennik
                    </button>
                </motion.div>
            </section>

            {/* 3D Innovation Vault (MVP & AI Automate in Royal Style) */}
            <section className="py-56 bg-[#2C1810] text-[#FBF7F2] relative perspective-[2500px]">
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/royal-lineage.png")' }} />
                <div className="container mx-auto px-8 relative z-10">
                    <div className="text-center mb-40">
                        <span className="text-[#B8860B] text-7xl mb-8 block">❦</span>
                        <h2 className="text-6xl font-bold uppercase tracking-[0.3em] mb-8">Krypta Innowacji</h2>
                        <p className="text-[#B8860B] font-bold uppercase tracking-[0.6em] text-[10px]">Łączymy Wieki z Technologią</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
                        {/* MVP 3D - Royal Version */}
                        <motion.div
                            initial={{ opacity: 0, y: 100, rotateY: -15 }}
                            whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5 }}
                            className="group relative h-[700px] border border-[#B8860B]/20 bg-black/20 rounded-sm p-20 flex flex-col justify-between overflow-hidden transform-gpu hover:shadow-[0_50px_100px_rgba(184,134,11,0.1)]"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-[#B8860B]/5 to-transparent pointer-events-none" />
                            <div className="relative">
                                <Box className="w-16 h-16 text-[#B8860B] mb-12" />
                                <h3 className="text-5xl font-black uppercase tracking-widest mb-10">Program <br /><span className="text-[#B8860B]">MVP</span></h3>
                                <p className="text-2xl italic text-[#FBF7F2]/60 leading-relaxed font-light">Magnificum Viae Proiectum. Szlachetna droga ku przyszłości poprzez realizację wielkich idei w małych krokach.</p>
                            </div>
                            <div className="pt-16 border-t border-[#B8860B]/10 flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#B8860B]">Status: Imprimatur</span>
                                <div className="w-20 h-20 rounded-full border border-[#B8860B]/30 flex items-center justify-center group-hover:bg-[#B8860B] transition-all">
                                    <ArrowUpRight className="w-10 h-10 group-hover:text-black" />
                                </div>
                            </div>
                        </motion.div>

                        {/* AI Automate - Royal Version */}
                        <motion.div
                            initial={{ opacity: 0, y: 150, rotateY: 15 }}
                            whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, delay: 0.3 }}
                            className="group relative h-[700px] border border-[#B8860B]/20 bg-black/20 rounded-sm p-20 flex flex-col justify-between overflow-hidden transform-gpu hover:shadow-[0_50px_100px_rgba(184,134,11,0.1)]"
                        >
                            <div className="absolute inset-0 bg-gradient-to-bl from-[#B8860B]/5 to-transparent pointer-events-none" />
                            <div className="relative">
                                <Cpu className="w-16 h-16 text-[#B8860B] mb-12" />
                                <h3 className="text-5xl font-black uppercase tracking-widest mb-10">AI <br /><span className="text-[#B8860B]">Automate</span></h3>
                                <p className="text-2xl italic text-[#FBF7F2]/60 leading-relaxed font-light">Artificium Intellegentiae. Harmonia między ludzkim duchem a cyfrowym wsparciem w służbie nauki.</p>
                            </div>
                            <div className="pt-16 border-t border-[#B8860B]/10 flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#B8860B]">Standard: Excellentiae</span>
                                <div className="w-20 h-20 rounded-full border border-[#B8860B]/30 flex items-center justify-center group-hover:bg-[#B8860B] transition-all">
                                    <Zap className="w-10 h-10 group-hover:text-black" />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* History Timeline - Elegant Calligraphy Feel */}
            <section id="o-nas" className="py-56 px-8 container mx-auto scroll-mt-20 relative">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-40 items-start">
                    <div className="space-y-20">
                        <div className="space-y-6">
                            <div className="w-16 h-16 rounded-full border border-[#2C1810]/20 flex items-center justify-center text-[#B8860B]">
                                <History className="w-8 h-8" />
                            </div>
                            <h2 className="text-5xl font-black uppercase tracking-[0.3em] text-[#2C1810]">Kroniki Naszej <br /> Misji.</h2>
                        </div>

                        <div className="relative border-l-[1px] border-[#B8860B]/20 ml-8 pl-16 space-y-32 py-8">
                            {[
                                { year: "AD 2002", title: "Kamień Węgielny", desc: "Zalążek szkoły przy Parafii NMP, budowany na fundamencie wiary i oddaniu wspólnocie." },
                                { year: "AD 2017", title: "Nowa Siedziba", desc: "Przeniesienie do gmachu przy ul. Tetmajera 65A — przestrzeń godna nowoczesnej edukacji." },
                                { year: "Dzisiaj", title: "Pełnia Rozwoju", desc: "Dynamiczna społeczność liderów, dla których wartości są kompasem w nowoczesnym świecie." }
                            ].map((milestone, i) => (
                                <motion.div
                                    key={i}
                                    className="relative group"
                                >
                                    <div className="absolute -left-[74px] top-2 w-4 h-4 bg-[#B8860B] rotate-45 transform-gpu group-hover:scale-150 transition-transform" />
                                    <h3 className="text-[#B8860B] font-bold uppercase tracking-[0.5em] text-[10px] mb-4">{milestone.year}</h3>
                                    <h4 className="text-4xl font-bold mb-6 tracking-tight">{milestone.title}</h4>
                                    <p className="text-2xl leading-[1.6] text-[#5D4037] font-light max-w-lg italic">{milestone.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="relative pt-24 lg:pt-0">
                        <div className="absolute -inset-10 border border-[#B8860B]/10 -z-10 translate-x-10 translate-y-10 group-hover:translate-x-5 group-hover:translate-y-5 transition-all duration-1000" />
                        <div className="overflow-hidden rounded-sm shadow-[0_50px_100px_rgba(0,0,0,0.15)] relative group">
                            <img
                                src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=1200"
                                className="w-full h-auto grayscale-[40%] hover:grayscale-0 transition-all duration-2000 hover:scale-105"
                                alt="Heritage Architecture"
                            />
                            <div className="absolute inset-0 bg-[#3E2723]/10 group-hover:bg-transparent transition-colors" />
                        </div>
                        <div className="absolute -bottom-16 -left-16 p-16 bg-[#2C1810] text-[#FBF7F2] shadow-3xl max-w-md border border-[#B8860B]/20">
                            <div className="text-[#B8860B] text-4xl mb-8">❧</div>
                            <p className="text-xl italic leading-loose font-light">
                                Nasza przeszłość jest bogata w tradycję, ale to nasza przyszłość jest tym, co kształtujemy każdego dnia z najwyższą starannością.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Krzewienie Talentów - Detailed Royal Grid */}
            <section id="oferta" className="py-64 bg-[#FBF7F2] border-t border-[#B8860B]/10 scroll-mt-20 relative overflow-hidden">
                <div className="container mx-auto px-8 relative z-10">
                    <div className="text-center mb-40">
                        <h2 className="text-7xl font-bold uppercase tracking-[0.3em] text-[#2C1810] mb-8 leading-none">Pola <br /> Szlachetności.</h2>
                        <div className="flex justify-center items-center gap-12 mt-12">
                            <div className="h-px w-20 bg-[#B8860B]/20" />
                            <div className="text-[10px] font-black uppercase tracking-[0.6em] text-[#B8860B]">Curriculum Vitae</div>
                            <div className="h-px w-20 bg-[#B8860B]/20" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-24 items-start">
                        {[
                            { icon: ScrollText, title: "Siedem Sztuk", items: schoolData.activities.scientific },
                            { icon: PartyPopper, title: "Expresja Duszy", items: schoolData.activities.artistic },
                            { icon: HeartHandshake, title: "Hartowanie", items: schoolData.activities.sport }
                        ].map((cat, i) => (
                            <div key={i} className="text-center space-y-16 group">
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-full border border-[#B8860B]/40 flex items-center justify-center text-[#B8860B] mx-auto relative z-10 group-hover:bg-[#B8860B]/5 transition-colors">
                                        <cat.icon className="w-10 h-10 group-hover:scale-110 transition-transform" />
                                    </div>
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl font-black opacity-[0.03] select-none italic text-[#B8860B]">0{i + 1}</div>
                                </div>
                                <h3 className="text-3xl font-black uppercase tracking-[0.2em]">{cat.title}</h3>
                                <div className="w-12 h-px bg-[#B8860B]/30 mx-auto" />
                                <ul className="space-y-10 font-bold text-[#5D4037]/80 italic">
                                    {cat.items.slice(0, 5).map(item => (
                                        <li key={item} className="text-2xl relative inline-block group/li transition-all hover:text-black hover:tracking-wide">
                                            <span className="relative z-10">{item}</span>
                                            <div className="absolute -bottom-2 left-0 right-0 h-px bg-[#B8860B]/5 group-hover/li:bg-[#B8860B]/40 transition-all" />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Royal Footer - Deep & Definitive */}
            <footer id="kontakt" className="bg-[#1A0F0D] text-[#FBF7F2] py-64 scroll-mt-20 border-t border-[#B8860B]/10 relative overflow-hidden">
                <div className="absolute bottom-0 right-0 opacity-[0.02] -mb-20 -mr-20 pointer-events-none">
                    <Landmark className="w-[1200px] h-[1200px]" />
                </div>

                <div className="container mx-auto px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-32 items-start">
                        <div className="lg:col-span-2 space-y-20">
                            <div className="flex items-center gap-10">
                                <img src={schoolData.logo} alt="Emblem" className="w-24 h-24 grayscale brightness-[5] opacity-20" />
                                <div>
                                    <h4 className="text-3xl font-black tracking-[0.1em] leading-none uppercase">{schoolData.name}</h4>
                                    <p className="text-[11px] uppercase font-black tracking-[0.6em] text-[#B8860B] mt-4 italic opacity-60">Sedes Sapientiae</p>
                                </div>
                            </div>
                            <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] uppercase">Dialog <br /><span className="text-[#B8860B]">Otwarty.</span></h2>
                        </div>

                        <div className="space-y-16">
                            <div className="space-y-4">
                                <p className="text-[#B8860B] font-black uppercase tracking-[0.5em] text-[10px] mb-8">Kontakt bezpośredni</p>
                                <a href={`tel:${schoolData.contact.phone}`} className="text-4xl font-bold hover:text-[#B8860B] transition-colors block italic">{schoolData.contact.phone}</a>
                                <div className="h-px w-12 bg-[#B8860B]/20 my-6" />
                                <a href={`mailto:${schoolData.contact.email}`} className="text-2xl font-medium underline underline-offset-[16px] decoration-[#B8860B]/20 hover:text-white transition-all block truncate">{schoolData.contact.email}</a>
                            </div>
                        </div>

                        <div className="space-y-16">
                            <div className="space-y-6">
                                <p className="text-[#B8860B] font-black uppercase tracking-[0.5em] text-[10px] mb-8">Lokalizacja Gdynia</p>
                                <p className="text-3xl font-bold italic">{schoolData.contact.address}</p>
                                <p className="text-lg opacity-40 uppercase tracking-widest pt-6">Rzeczpospolita Polska</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-64 border-t border-white/5 pt-20 flex flex-col md:flex-row justify-between items-center gap-16 text-[10px] font-black uppercase tracking-[0.8em]">
                        <p className="opacity-30 italic">© Anno Domini 2026 NAZARET PAROCHIALIS</p>
                        <div className="flex gap-16 text-[#B8860B]">
                            <a href="#" className="hover:text-white transition-all hover:tracking-[1em]">Statuta</a>
                            <a href="#" className="hover:text-white transition-all hover:tracking-[1em]">BIP</a>
                            <a href="#" className="hover:text-white transition-all hover:tracking-[1em]">GDPR</a>
                        </div>
                        <p className="opacity-30">All Rights Reserved</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
