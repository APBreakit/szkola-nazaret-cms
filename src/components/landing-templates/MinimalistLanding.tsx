"use client"

import { schoolData } from "@/lib/school-data"
import { motion, useScroll, useTransform } from "framer-motion"
import { LayoutGrid, CheckCircle, ArrowUpRight, GraduationCap, MapPin, Calendar, Users, Award, Shield, Shapes, Box, Cpu } from "lucide-react"
import { useRef } from "react"

export function MinimalistLanding() {
    const containerRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    })

    return (
        <div ref={containerRef} className="min-h-screen bg-[#FFFFFF] text-[#1A1A1A] selection:bg-[#F2C91F]/30 font-sans tracking-tight antialiased selection:text-black">
            {/* Structural Grid Background */}
            <div className="fixed inset-0 pointer-events-none -z-10 opacity-[0.02]"
                style={{ backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)', backgroundSize: '100px 100px' }} />

            {/* Hero Section - Maximum Minimalism */}
            <section id="start" className="pt-56 pb-40 px-8 container mx-auto scroll-mt-20">
                <div className="max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">
                    <div className="lg:col-span-9 space-y-16">
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.4em] text-[#8D083B]"
                        >
                            <div className="w-10 h-px bg-[#8D083B]" />
                            Educational Institution • Gdynia • EU
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            className="text-[10vw] md:text-[8.5rem] font-bold tracking-tighter leading-[0.82] text-black"
                        >
                            Uczymy <br /> Wolności. <br /> <span className="text-[#8D083B]">Wartości.</span>
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-black/5 pt-20"
                        >
                            <div>
                                <div className="text-5xl font-black tabular-nums tracking-tighter italic">300+</div>
                                <div className="text-[9px] text-muted-foreground uppercase font-black tracking-[0.2em] mt-3">Uczniów</div>
                            </div>
                            <div>
                                <div className="text-5xl font-black tabular-nums tracking-tighter italic">2002</div>
                                <div className="text-[9px] text-muted-foreground uppercase font-black tracking-[0.2em] mt-3">Założenie</div>
                            </div>
                            <div>
                                <div className="text-5xl font-black tabular-nums tracking-tighter italic">100%</div>
                                <div className="text-[9px] text-muted-foreground uppercase font-black tracking-[0.2em] mt-3">Bezpieczeństwa</div>
                            </div>
                            <div>
                                <div className="text-5xl font-black tabular-nums tracking-tighter italic">25+</div>
                                <div className="text-[9px] text-muted-foreground uppercase font-black tracking-[0.2em] mt-3">Zajęć</div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="lg:col-span-3 space-y-12">
                        <div className="p-8 bg-black text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden group cursor-crosshair">
                            <p className="text-2xl font-medium leading-[1.3] relative z-10 transition-transform group-hover:-translate-y-2">
                                Tworzymy fundamenty pod przyszłość, która wymaga charakteru.
                            </p>
                            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="space-y-4">
                            <button className="w-full py-8 bg-[#F8F9FA] border border-slate-200 text-black rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-black hover:text-white transition-all shadow-sm">
                                Rekrutacja 2026/27
                            </button>
                            <p className="text-[9px] text-muted-foreground text-center uppercase tracking-widest font-bold">Standard NGO/Public</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* NEW: 3D Innovation Lab (MVP & AI Automate in Minimalist style) */}
            <section className="py-40 bg-[#1A1A1A] text-white">
                <div className="container mx-auto px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                        <div className="lg:col-span-5 space-y-12">
                            <h2 className="text-6xl font-bold tracking-tighter leading-none">Innovation <br /> Lab.</h2>
                            <p className="text-xl text-white/50 leading-relaxed max-w-sm">Wprowadzamy pionierskie programy, które wyznaczają kierunki nowoczesnej edukacji.</p>
                            <div className="pt-8 flex gap-8">
                                <div className="aspect-square w-32 border border-white/10 rounded-full flex items-center justify-center animate-spin-slow">
                                    <Cpu className="text-[#8D083B] w-12 h-12" />
                                </div>
                                <p className="text-sm font-black uppercase tracking-[0.3em] self-center">AI Integration 2.0</p>
                            </div>
                        </div>
                        <div className="lg:col-span-7 grid md:grid-cols-2 gap-8 perspective-[1500px]">
                            {/* MVP 3D - Focused on depth */}
                            <motion.div
                                whileHover={{ rotateY: -10, translateZ: 50 }}
                                className="p-16 bg-white rounded-[3rem] text-black shadow-3xl transform-gpu flex flex-col justify-between h-[500px]"
                            >
                                <Box className="w-12 h-12 text-[#8D083B] mb-8" />
                                <h3 className="text-4xl font-black tracking-tighter lowercase">MVP Program</h3>
                                <p className="text-muted-foreground font-medium">Uczymy jak budować od zera. Metodyka startupowa w nauczaniu projektowym.</p>
                                <div className="h-px bg-black/5 w-full mt-8" />
                                <p className="text-[10px] font-black uppercase mt-4">Status: Deployment</p>
                            </motion.div>

                            {/* AI Automate - High performance minimalist */}
                            <motion.div
                                whileHover={{ rotateY: 10, translateZ: 50 }}
                                className="p-16 bg-[#8D083B] rounded-[3rem] text-white shadow-3xl transform-gpu flex flex-col justify-between h-[500px]"
                            >
                                <Cpu className="w-12 h-12 mb-8" />
                                <h3 className="text-4xl font-black tracking-tighter lowercase">AI Automate</h3>
                                <p className="text-white/60 font-medium">Algorytmy wspierające nauczycieli. Automatyzacja rutyny na rzecz relacji.</p>
                                <div className="h-px bg-white/10 w-full mt-8" />
                                <p className="text-[10px] font-black uppercase mt-4">Standard: Enterprise AI</p>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bento Architecture - Editorial Style */}
            <section id="o-nas" className="py-48 px-8 container mx-auto scroll-mt-20">
                <div className="grid grid-cols-1 md:grid-cols-12 auto-rows-[350px] gap-8">
                    <div className="md:col-span-8 md:row-span-2 bg-[#F8F9FA] rounded-[4rem] p-20 flex flex-col justify-between relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-24 opacity-5 translate-x-12 -translate-y-12 transition-transform duration-1000 group-hover:translate-x-0 group-hover:translate-y-0">
                            <GraduationCap className="w-80 h-80" />
                        </div>
                        <div className="relative max-w-xl z-10">
                            <h3 className="text-6xl font-black mb-12 tracking-tight">Kanon <br />Świętej Rodziny.</h3>
                            <p className="text-2xl text-black/60 leading-relaxed font-medium">{schoolData.history.description}</p>
                        </div>
                        <div className="flex gap-6 z-10 relative">
                            <span className="px-8 py-3 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-widest shadow-xl">Heritage</span>
                            <span className="px-8 py-3 rounded-full bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest">Since 2002</span>
                        </div>
                    </div>

                    <div className="md:col-span-4 md:row-span-2 bg-black text-white rounded-[4rem] p-16 flex flex-col justify-between shadow-3xl">
                        <Calendar className="w-12 h-12 text-[#8D083B]" />
                        <div className="space-y-12">
                            <h4 className="text-5xl font-bold tracking-tighter leading-none italic">Zapisy Otwieramy <br /> w Lutym.</h4>
                            <ul className="space-y-6 text-[11px] font-black uppercase tracking-widest border-t border-white/10 pt-12">
                                <li className="flex items-center gap-4"><CheckCircle className="w-4 h-4 text-[#8D083B]" /> Interview Phase</li>
                                <li className="flex items-center gap-4"><CheckCircle className="w-4 h-4 text-[#8D083B]" /> Pedagogical Review</li>
                                <li className="flex items-center gap-4"><CheckCircle className="w-4 h-4 text-[#8D083B]" /> Admission Letter</li>
                            </ul>
                        </div>
                    </div>

                    <div className="md:col-span-4 bg-[#8D083B] rounded-[4rem] p-16 text-white flex flex-col justify-between group cursor-help transition-all hover:scale-[0.98]">
                        <Shield className="w-12 h-12 text-white/40" />
                        <h4 className="text-3xl font-black leading-none uppercase tracking-tighter">100% Catholic <br /> Values.</h4>
                    </div>

                    <div className="md:col-span-8 bg-slate-100 rounded-[4rem] p-16 flex items-center justify-between group overflow-hidden relative">
                        <div className="flex items-center gap-12">
                            <Users className="w-20 h-20 text-black/10 group-hover:scale-110 transition-transform" />
                            <h4 className="text-4xl font-bold tracking-tighter uppercase">Zgrana Społeczność Ponad 300 Uczniów.</h4>
                        </div>
                        <div className="w-24 h-24 rounded-full border border-black/10 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                            <ArrowUpRight className="w-10 h-10" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Activities Grid - Ultra Editorial Detail */}
            <section id="oferta" className="py-56 bg-[#FDFCFB] border-t border-slate-100 scroll-mt-20">
                <div className="container mx-auto px-8">
                    <div className="flex flex-col md:flex-row justify-between items-baseline mb-40 gap-12">
                        <h2 className="text-[12rem] font-black tracking-tighter leading-[0.7] opacity-5 select-none">01 02 03</h2>
                        <div className="max-w-md space-y-8">
                            <h2 className="text-8xl font-black tracking-tighter">Beyond.</h2>
                            <p className="text-2xl text-muted-foreground font-medium leading-relaxed italic">Wszechstronny rozwój, który nie uznaje kompromisów.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-y-32 gap-x-24">
                        {Object.entries(schoolData.activities).map(([key, list], idx) => (
                            <div key={key} className="space-y-12">
                                <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-[#8D083B] flex items-center gap-6">
                                    <span className="w-16 h-[2px] bg-[#8D083B]" />
                                    {key} Pillar
                                </h4>
                                <ul className="space-y-6">
                                    {list.map((item) => (
                                        <li key={item} className="group flex items-end justify-between border-b border-slate-200 pb-6 hover:border-black transition-colors">
                                            <span className="text-4xl font-bold tracking-tighter text-black group-hover:italic transition-all">{item}</span>
                                            <Shapes className="w-8 h-8 opacity-0 group-hover:opacity-100 group-hover:rotate-12 transition-all translate-x-4 group-hover:translate-x-0" />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section - High Contrast Footer CTA */}
            <section id="kontakt" className="py-64 bg-black text-white overflow-hidden relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] bg-[#8D083B]/20 blur-[200px] pointer-events-none" />
                <div className="container mx-auto px-8 relative z-10 text-center space-y-24">
                    <motion.h2
                        whileInView={{ scale: [0.95, 1], opacity: [0, 1] }}
                        className="text-[8vw] md:text-[12rem] font-bold tracking-tighter leading-none"
                    >
                        Let's Talk.
                    </motion.h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-24 text-left max-w-6xl mx-auto">
                        <div className="space-y-8">
                            <p className="text-[11px] font-black uppercase tracking-[0.5em] opacity-40">Main Office</p>
                            <a href={`tel:${schoolData.contact.phone}`} className="text-6xl font-bold hover:text-[#8D083B] transition-colors block">{schoolData.contact.phone}</a>
                            <p className="text-xl opacity-60 font-medium">Sekretariat szkoły Nazaret</p>
                        </div>
                        <div className="space-y-8">
                            <p className="text-[11px] font-black uppercase tracking-[0.5em] opacity-40">E-mail Inquiries</p>
                            <a href={`mailto:${schoolData.contact.email}`} className="text-4xl md:text-5xl font-bold underline underline-offset-[20px] hover:text-[#47A5E2] transition-colors block decoration-white/10">{schoolData.contact.email}</a>
                            <p className="text-xl opacity-60 font-medium">Odpowiadamy w 24h</p>
                        </div>
                    </div>

                    <div className="pt-40 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12 text-[10px] font-black uppercase tracking-[0.8em]">
                        <p>© 2026 NAZARET SCHOOL</p>
                        <div className="flex gap-20">
                            <a href="#" className="hover:text-[#8D083B] transition-colors">Career</a>
                            <a href="#" className="hover:text-[#8D083B] transition-colors">Press</a>
                            <a href="#" className="hover:text-[#8D083B] transition-colors">Legal</a>
                        </div>
                        <p>GDYNIA, TETMAJERA 65A</p>
                    </div>
                </div>
            </section>
        </div>
    )
}
