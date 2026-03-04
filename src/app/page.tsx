"use client";

import { useRef, useTransition, useState, useEffect } from "react";
import { createPost } from "./actions";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Newspaper, CheckCircle2, ChevronRight, School, BookOpen, AlertCircle } from "lucide-react";

type Post = {
  id: string;
  title: string;
  excerpt: string | null;
  type: string;
  createdAt: string | Date;
}

export default function Home() {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  useEffect(() => {
    // In a real app we would use a server component to fetch data, but using an API/Server Action here
    // for direct demonstration and error handling gracefully if DB is not connected.
    async function init() {
      try {
        const { getPosts } = await import("./actions");
        const data = await getPosts();
        // Assume failure if it's not an array
        if (!Array.isArray(data)) {
          setErrorStatus("Klucze bazy danych z Prisma nie są poprawnie skonfigurowane.");
          return;
        }
        setPosts(data as any);
      } catch (e: any) {
        console.error(e);
        setErrorStatus(e.message || "Błąd bazy danych");
      }
    }
    init();
  }, []);

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const { success, error, post } = await createPost(formData);
      if (success) {
        formRef.current?.reset();
        setPosts((prev) => [post as any, ...prev].slice(0, 10)); // Optimistic UI update
      } else {
        alert("Błąd podczas zapisywania danych: " + (error || "Sprawdź plik .env"));
      }
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'news': return <Newspaper className="w-5 h-5 text-blue-500" />;
      case 'event': return <Calendar className="w-5 h-5 text-purple-500" />;
      default: return <BookOpen className="w-5 h-5 text-green-500" />;
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'news': return 'Aktualność';
      case 'event': return 'Wydarzenie';
      default: return 'Inne';
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white selection:bg-blue-500/30 font-sans">
      {/* Dynamic Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-[#0A0A0B] to-[#0A0A0B] -z-10 pointer-events-none" />

      <main className="container mx-auto px-4 py-16 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center justify-center p-3 bg-white/5 rounded-2xl mb-6 ring-1 ring-white/10 shadow-2xl backdrop-blur-xl">
            <School className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-br from-white via-white/90 to-white/40 bg-clip-text text-transparent">
            Panel <span className="text-blue-500">CMS</span> Szkoły
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Ten minimalistyczny interfejs demonstruje poprawne połączanie nowoczesnego
            stacku Twojego środowiska (Next.js 15, Prisma, Supabase PostgreSQL).
          </p>
        </motion.div>

        {errorStatus && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-3xl mx-auto mb-12 p-6 bg-red-500/10 ring-1 ring-red-500/20 rounded-2xl flex items-start gap-4"
          >
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-red-400 font-medium text-lg mb-1">Brak bezpośredniego połączenia z Bazą Danych Prisma!</h3>
              <p className="text-zinc-400">Musisz połączyć Supabase jako swoją bazę danych, a następnie uruchomić polecenie: <code className="bg-black/30 px-2 py-1 rounded text-red-300 ring-1 ring-red-500/10 text-sm">npx prisma db push</code></p>
            </div>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Create Post Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-4"
          >
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-400" />
                Utwórz nowy wpis
              </h2>

              <form ref={formRef} action={handleSubmit} className="space-y-5 relative z-10">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-400">Tytuł wpisu</label>
                  <input
                    name="title"
                    required
                    placeholder="Wpisz np. Relacja z dnia sportu..."
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-400">Typ</label>
                  <select
                    name="type"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  >
                    <option value="news" className="bg-zinc-900">Aktualność</option>
                    <option value="event" className="bg-zinc-900">Wydarzenie</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-400">Treść (Skrót)</label>
                  <textarea
                    name="content"
                    required
                    rows={4}
                    placeholder="Krótka treść aktualności..."
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full group relative flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium py-3.5 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden shadow-lg shadow-blue-900/20"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {isPending ? 'Zapisywanie w bazie...' : 'Publikuj'}
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-white/10 to-blue-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </button>
              </form>
            </div>
          </motion.div>

          {/* Posts Grid List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-8"
          >
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 backdrop-blur-xl">
              <h2 className="text-xl font-semibold mb-6">Ostatnio dodane wpisy (Baza Danych)</h2>

              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence>
                  {posts.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-16 text-zinc-500 border border-dashed border-white/10 rounded-xl"
                    >
                      Brak wpisów w bazie. Dodaj pierwszy formularzem po lewej stronie!
                    </motion.div>
                  ) : (
                    posts.map((post, i) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: i * 0.05 }}
                        className="group flex gap-5 bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 rounded-xl p-5 transition-all cursor-default"
                      >
                        <div className="mt-1">
                          <div className="p-2.5 bg-black/40 rounded-lg ring-1 ring-white/5 shadow-inner">
                            {getTypeIcon(post.type)}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <span className="text-xs font-medium text-zinc-500 tracking-wider uppercase mb-1.5 block">
                                {getTypeName(post.type)}
                              </span>
                              <h3 className="text-lg font-medium text-white group-hover:text-blue-400 transition-colors">
                                {post.title}
                              </h3>
                            </div>
                            <span className="text-xs text-zinc-600 whitespace-nowrap bg-black/30 px-2 py-1 rounded-md">
                              {new Date(post.createdAt).toLocaleDateString("pl-PL")}
                            </span>
                          </div>
                          <p className="text-sm text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                            {post.excerpt || 'Brak treści...'}
                          </p>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
