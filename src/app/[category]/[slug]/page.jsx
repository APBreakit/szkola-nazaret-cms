import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { getPublicPostBySlug } from "@/app/actions/public-actions"
import { Calendar, Megaphone, Trophy, Users, FileText, Image as ImageIcon, Eye } from "lucide-react"
import Image from "next/image"
import Head from "next/head"
import Link from "next/link"
import { getPublicPosts } from "@/app/actions/public-actions"

export default async function PostDetailPage({ params }) {
  const { category, slug } = await params
  const post = await getPublicPostBySlug(category, slug)

  const accent =
    category === "ogloszenia"
      ? { bg: "bg-purple-50", text: "text-purple-700" }
      : category === "konkursy"
        ? { bg: "bg-amber-50", text: "text-amber-700" }
        : category === "rada-rodzicow"
          ? { bg: "bg-gray-100", text: "text-gray-700" }
          : category === "okiem-specjalisty"
            ? { bg: "bg-emerald-50", text: "text-emerald-700" }
            : { bg: "bg-blue-50", text: "text-blue-700" }
  const Icon =
    category === "ogloszenia"
      ? Megaphone
      : category === "konkursy"
        ? Trophy
        : category === "rada-rodzicow"
          ? Users
          : category === "okiem-specjalisty"
            ? Eye
            : Calendar

  // Breadcrumb
  const categoryLabel =
    category === "ogloszenia"
      ? "Ogłoszenia"
      : category === "konkursy"
        ? "Konkursy"
        : category === "rada-rodzicow"
          ? "Rada Rodziców"
          : category === "okiem-specjalisty"
            ? "Okiem specjalisty"
            : "Aktualności"
  const categoryHref = category === "okiem-specjalisty" ? "/aktualnosci" : `/${category}`

  // Prev/Next within category
  let prevUrl = null
  let nextUrl = null
  const list = await getPublicPosts(category)
  if (list && list.length) {
    const idx = list.findIndex((p) => p.slug === slug)
    if (idx >= 0) {
      const prev = list[idx + 1]
      const next = list[idx - 1]
      prevUrl = prev ? `/${category}/${prev.slug || prev.id}` : null
      nextUrl = next ? `/${category}/${next.slug || next.id}` : null
    }
  }

  // Extract Blob attachments from content
  const attachments = []
  const contentStr = typeof post?.content === "string" ? post?.content : ""
  const blobRegex = /(https?:\/\/[^\s]*vercel-storage\.com[^\s)"']+)/g
  const pdfOrImage = /\.(pdf|png|jpg|jpeg|webp)(\?|#|$)/i
  let m
  while ((m = blobRegex.exec(contentStr)) !== null) {
    const url = m[1]
    if (pdfOrImage.test(url)) {
      const name = url.split("/").pop() || "Załącznik"
      attachments.push({ url, name })
    }
  }

  async function formatBytes(n) {
    const units = ["B", "KB", "MB", "GB"]
    let i = 0
    let v = n
    while (v >= 1024 && i < units.length - 1) {
      v = v / 1024
      i++
    }
    return `${v.toFixed(v >= 100 ? 0 : v >= 10 ? 1 : 2)} ${units[i]}`
  }

  const attachmentsWithMeta = await Promise.all(
    attachments.map(async (a) => {
      let size = null
      try {
        const res = await fetch(a.url, { method: "HEAD" })
        const len = res.headers.get("content-length")
        size = len ? await formatBytes(Number(len)) : null
      } catch { }
      const ext = (a.name.split(".").pop() || "").toLowerCase()
      const isImage = ["png", "jpg", "jpeg", "webp"].includes(ext)
      const isPdf = ext === "pdf"
      return { ...a, size, ext, isImage, isPdf }
    })
  )

  const suggestionsAll = await getPublicPosts(undefined, 6)
  const suggestions = (suggestionsAll || []).filter((p) => p.id !== post?.id).slice(0, 3)

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Head>
        {prevUrl && <link rel="prev" href={prevUrl} />}
        {nextUrl && <link rel="next" href={nextUrl} />}
      </Head>
      <Navigation />
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="relative w-full h-64 rounded-2xl overflow-hidden border border-border mb-4 bg-card">
          {post?.image_url ? (
            <Image src={post.image_url} alt={post.title} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="w-10 h-10 text-muted-foreground" />
            </div>
          )}
        </div>
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
          <ol className="flex items-center gap-2">
            <li>
              <Link href={categoryHref} className="hover:underline">
                {categoryLabel}
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground">{post?.title || "Post"}</li>
          </ol>
        </nav>
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-12 h-12 rounded-xl ${accent.bg} flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${accent.text}`} />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl">{post?.title || "Post"}</h1>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Calendar className="w-4 h-4" />
          <span>{post?.created_at ? new Date(post.created_at).toLocaleDateString("pl-PL") : ""}</span>
        </div>

        {category === "konkursy" && (
          <div className="flex items-center gap-2 mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${accent.bg} ${accent.text}`}>{post?.competition_status || ""}</span>
            {post?.competition_start_date && post?.competition_end_date && (
              <span className="text-sm text-muted-foreground">
                {new Date(post.competition_start_date).toLocaleDateString("pl-PL")} – {new Date(post.competition_end_date).toLocaleDateString("pl-PL")}
              </span>
            )}
          </div>
        )}

        <article
          className="prose prose-neutral max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: post?.content || post?.excerpt || "" }}
        />

        {post?.images && Array.isArray(post.images) && post.images.length > 0 && (
          <div className="mt-12 border-t pt-8">
            <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-2">
              <ImageIcon className="w-6 h-6 text-blue-500" />
              Galeria
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {post.images.map((img, i) => (
                <div key={i} className="relative aspect-video rounded-2xl overflow-hidden border border-border shadow-sm group">
                  <Image
                    src={img}
                    alt=""
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {post?.attachments && post.attachments.length > 0 && (
          <div className="mt-8 border-t pt-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              Załączniki
            </h2>
            <div className="grid gap-3">
              {post.attachments.map((a, i) => (
                <a
                  key={i}
                  href={a.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center border border-gray-200 shadow-sm">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{a.file_name}</div>
                      {a.file_size && <div className="text-xs text-muted-foreground">{a.file_size}</div>}
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">POBIERZ</div>
                </a>
              ))}
            </div>
          </div>
        )}

        {post?.gallery_images && post.gallery_images.length > 0 && (
          <div className="mt-12 border-t pt-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-blue-500" />
              Galeria zdjęć
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {post.gallery_images.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group cursor-pointer">
                  <Image
                    src={img.image_url}
                    alt={img.title || `Zdjęcie ${i + 1}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {img.title && (
                    <div className="absolute inset-x-0 bottom-0 bg-black/60 p-2 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      {img.title}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="mt-12">
            <h2 className="text-lg font-semibold">Ostatnio dodane</h2>
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              {suggestions.map((s) => {
                const lbl =
                  s.type === "ogloszenia"
                    ? { bg: "bg-purple-50", text: "text-purple-700" }
                    : s.type === "konkursy"
                      ? { bg: "bg-amber-50", text: "text-amber-700" }
                      : s.type === "rada-rodzicow"
                        ? { bg: "bg-gray-100", text: "text-gray-700" }
                        : s.type === "okiem-specjalisty"
                          ? { bg: "bg-emerald-50", text: "text-emerald-700" }
                          : { bg: "bg-blue-50", text: "text-blue-700" }
                return (
                  <Link key={s.id} href={`/${s.type}/${s.slug}`} className="block rounded-xl border border-border overflow-hidden bg-card">
                    <div className="relative w-full h-32">
                      {s.image_url ? (
                        <Image src={s.image_url} alt={s.title} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="p-3 space-y-2">
                      <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs ${lbl.bg} ${lbl.text}`}>{s.type}</div>
                      <div className="text-sm font-medium line-clamp-2">{s.title}</div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}

export const dynamic = "force-dynamic"

export async function generateMetadata({ params: paramsPromise }) {
  const params = await paramsPromise;
  const post = await getPublicPostBySlug(params.category, params.slug)
  const title = post?.title ? `${post.title} | Katolicka Szkoła Podstawowa Nazaret` : "Post | Katolicka Szkoła Podstawowa Nazaret"
  const description = post?.excerpt || (post?.content ? String(post.content).slice(0, 160) : "")
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://szkołanazaret.com'
  const url = `${base}/${params.category}/${params.slug}`
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      images: post?.image_url ? [post.image_url] : undefined,
      type: "article",
    },
  }
}
