"use client"

import { useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowUpRight, Calendar, BookOpen, Heart, Users, MapPin, ChevronRight, Bell, Video, GraduationCap, Laptop, Sparkles, Cross, Church } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { getPublicPosts } from "@/app/actions/public-actions"

// Reusable animation variants
const fadeInUp: any = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
}

const staggerContainer: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
}

export default function ClientPage() {
  const [aktualnosci, setAktualnosci] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { scrollYProgress } = useScroll()
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])
  const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0])

  useEffect(() => {
    async function fetchPosts() {
      try {
        const aktualnosciData = await getPublicPosts("aktualnosci", 4)
        setAktualnosci(aktualnosciData || [])
      } catch (error) {
        console.error("Failed to fetch posts:", error)
        setAktualnosci([])
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  return (
    <main className="min-h-screen bg-background selection:bg-primary/30 font-sans">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[0%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[120px] mix-blend-multiply animate-pulse-soft" />
          <div className="absolute bottom-[-10%] right-[0%] w-[50%] h-[50%] rounded-full bg-secondary/20 blur-[120px] mix-blend-multiply animate-pulse-soft" style={{ animationDelay: '2s' }} />
        </div>

        <motion.div
          className="container mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center text-center -mt-16"
          style={{ y: yBg, opacity: opacityHero }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <Badge className="bg-card/60 backdrop-blur-md border border-white/20 text-foreground px-6 py-2 rounded-full text-sm font-medium mb-8 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.1)]">
            <Sparkles className="w-4 h-4 mr-2 inline text-accent" />
            Rekrutacja na rok szkolny 2026/2027 otwarta
          </Badge>

          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground max-w-5xl leading-[1.1] mb-8">
            Katolicka Szkoła Podstawowa <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">im. Świętej Rodziny</span>
          </h1>

          <p className="text-lg md:text-2xl text-muted-foreground max-w-3xl leading-relaxed mb-12 font-light">
            Razem tworzymy przyjazną przestrzeń do nauki i rozwoju. <br />
            "Miłości, wiary wzorem być, uczyć się pilnie i godnie żyć"
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button size="lg" asChild className="rounded-full px-8 py-6 text-lg gradient-1 hover:shadow-[0_8px_30px_-8px_var(--primary)] transition-all hover:scale-105 border-0 text-white">
              <Link href="/rekrutacja">Zapisz dziecko</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="rounded-full px-8 py-6 text-lg bg-card/60 backdrop-blur-sm border-white/20 hover:bg-card/80 transition-all hover:scale-105 text-foreground shadow-sm">
              <Link href="#o-nas">Poznaj naszą szkołę</Link>
            </Button>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Odkryj</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent" />
        </motion.div>
      </section>

      {/* Bento Grid - Core Values */}
      <section id="o-nas" className="py-24 sm:py-32 relative z-10 w-full overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
          >
            {/* Bento Item 1: Large Intro */}
            <motion.div variants={fadeInUp} className="md:col-span-2 lg:col-span-2 rounded-[2.5rem] p-8 md:p-12 overflow-hidden relative group bg-card/80 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-xl transition-all duration-500">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors duration-500" />
              <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6 text-foreground relative z-10 w-11/12 leading-tight">
                Rozwój w duchu chrześcijańskich wartości
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed relative z-10 max-w-xl font-light">
                Nasza szkoła funkcjonuje w duchu wartości chrześcijańskich, opierając się na katolickim nauczaniu społecznym, kształtując w uczniach postawę otwartości i zaangażowania w życie Kościoła.
              </p>
              <div className="mt-8 flex gap-4 relative z-10">
                <Badge className="bg-primary/10 text-primary border-0 px-5 py-2.5 rounded-full text-sm">Tradycja</Badge>
                <Badge className="bg-secondary/10 text-secondary-foreground border-0 px-5 py-2.5 rounded-full text-sm">Edukacja</Badge>
              </div>
            </motion.div>

            {/* Bento Item 2: Nauka i rozwój */}
            <motion.div variants={fadeInUp} className="rounded-[2.5rem] p-8 md:p-10 bg-gradient-to-br from-primary to-[#b83358] text-white backdrop-blur-xl shadow-xl relative overflow-hidden group">
              <BookOpen className="w-12 h-12 mb-6 text-white/90 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500" />
              <h3 className="font-serif font-bold text-2xl mb-4">Nauka i rozwój</h3>
              <p className="text-white/80 leading-relaxed font-light">
                Wysoki poziom kształcenia i wszechstronny rozwój ucznia to aspekty, na które kładziemy szczególny nacisk w edukacji.
              </p>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            </motion.div>

            {/* Bento Item 3: Wspólne pasje */}
            <motion.div variants={fadeInUp} className="rounded-[2.5rem] p-8 md:p-10 bg-card/80 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-xl relative overflow-hidden group hover:border-secondary/30 transition-colors">
              <Users className="w-12 h-12 mb-6 text-secondary group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500" />
              <h3 className="font-serif font-bold text-2xl mb-4 text-foreground">Wspólne pasje</h3>
              <p className="text-muted-foreground leading-relaxed font-light">
                Koła zainteresowań i zajęcia pozalekcyjne pozwalają odnajdywać oraz rozwijać pasje i talenty. U nas każdy znajdzie coś dla siebie!
              </p>
            </motion.div>

            {/* Bento Item 4: Image/Visual with Call to Action */}
            <motion.div variants={fadeInUp} className="rounded-[2.5rem] md:col-span-2 bg-muted/30 overflow-hidden relative min-h-[350px] border border-white/40 dark:border-white/10 shadow-xl group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" />

              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 z-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                  <Church className="w-8 h-8 text-white/80 mb-4" />
                  <h3 className="text-white font-serif text-3xl mb-3">Społeczność Nazaretu</h3>
                  <p className="text-white/80 max-w-md font-light text-base md:text-lg">Kształtujemy charaktery w duchu miłości, wiary i wzajemnego szacunku.</p>
                </div>
                <Button variant="outline" className="rounded-full bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white hover:text-black transition-all" asChild>
                  <Link href="/o-nas">Czytaj więcej</Link>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Aktualności Carousel - Sleek Liquid Glass Version */}
      <section className="py-24 relative z-10 bg-muted/30 border-y border-border/50">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 max-w-7xl mx-auto"
          >
            <div className="max-w-2xl">
              <Badge className="bg-secondary/10 text-secondary border border-secondary/20 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
                Wydarzenia
              </Badge>
              <h2 className="font-serif text-4xl md:text-5xl text-foreground font-bold">Aktualności</h2>
              <p className="text-muted-foreground mt-4 text-lg font-light">Najświeższe informacje z życia szkoły, osiągnięcia uczniów i komunikaty.</p>
            </div>
            <Link href="/aktualnosci" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-card/80 backdrop-blur-md hover:bg-card border border-white/40 dark:border-white/10 shadow-sm transition-all hover:shadow-md font-medium text-sm text-foreground">
              Więcej aktualności
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="rounded-[2rem] bg-card/50 backdrop-blur-sm h-[400px] animate-pulse border border-border/50" />
                ))}
              </div>
            ) : aktualnosci.length === 0 ? (
              <div className="text-center py-20 bg-card/50 backdrop-blur-md rounded-[2rem] border border-white/20">
                <p className="text-muted-foreground text-lg">Brak aktualności w tym momencie.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {aktualnosci.map((post, idx) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1, duration: 0.6 }}
                  >
                    <Link href={`/${post.type}/${post.slug}`} className="group block h-full">
                      <div className="flex flex-col h-full bg-card/60 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-[2rem] overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.05)] hover:-translate-y-2 transition-all duration-300">
                        <div className="relative h-56 overflow-hidden bg-muted/50">
                          {post.image_url ? (
                            <Image
                              src={post.image_url}
                              alt={post.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-primary/5">
                              <BookOpen className="w-12 h-12 text-primary/20" />
                            </div>
                          )}
                          <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-medium text-foreground flex items-center gap-1.5 shadow-sm border border-border/50">
                            <Calendar className="w-3 h-3 text-primary" />
                            {new Date(post.created_at).toLocaleDateString("pl-PL")}
                          </div>
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                          <h3 className="font-serif text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-grow font-light">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center font-semibold text-primary text-sm mt-auto">
                            Czytaj dalej
                            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Warto mieć pod ręką - Quick Links / Bento Row */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl md:text-5xl text-foreground font-bold mb-4">Warto mieć pod ręką</h2>
            <p className="text-muted-foreground text-lg font-light">Niezbędnik ucznia i rodzica w jednym miejscu</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {[
              { title: "Dziennik Elektroniczny", desc: "Logowanie do sytemu Librus", icon: Laptop, link: "https://portal.librus.pl/rodzina", external: true },
              { title: "Materiały i Dokumenty", desc: "Wymagane dokumenty", icon: BookOpen, link: "/dokumenty", external: false },
              { title: "Galeria Szkolna", desc: "Wideo i zdjęcia z wydarzeń", icon: Video, link: "/galeria", external: false },
              { title: "Plan Zajęć", desc: "Zajęcia pozalekcyjne", icon: Calendar, link: "/aktualnosci", external: false },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
              >
                <Link href={item.link} target={item.external ? "_blank" : undefined} className="flex flex-col items-center text-center p-8 rounded-[2.5rem] bg-card/60 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg hover:shadow-xl hover:border-primary/30 transition-all duration-500 group hover:-translate-y-2 h-full">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-500 shadow-inner">
                    <item.icon className="w-8 h-8 text-primary group-hover:text-white transition-colors duration-500" />
                  </div>
                  <h3 className="font-serif font-bold text-xl text-foreground mb-3">{item.title}</h3>
                  <p className="text-sm text-muted-foreground font-light">{item.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
