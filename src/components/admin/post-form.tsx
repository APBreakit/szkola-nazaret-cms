"use client"

import type React from "react"
import { optimizeImage } from "@/lib/utils/image-optimizer"
import { getGroupsPublic } from "@/app/actions/public-actions"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createPost, updatePost } from "@/app/actions/admin-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Save, Upload, X, Paperclip, Image as ImageIcon, Plus, FileText } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import { RichTextEditor } from "@/components/ui/rich-text-editor"

interface PostFormProps {
  userId: string
  post?: {
    id: string
    title: string
    content: string | null
    excerpt: string | null
    type: string
    status: string | null
    image_url: string | null
    add_to_calendar: boolean | null
    calendar_date: string | null | Date
    calendar_end_date: string | null | Date
    competition_status: string | null
    competition_start_date: string | null | Date
    competition_end_date: string | null | Date
    group_category: string | null
    attachments?: Array<{ id: string; file_url: string; file_name: string; file_size: string | null }>
    gallery_images?: Array<{ id: string; image_url: string; title: string | null; sort_order: number | null }>
    images?: string[] | null
  }
}

interface Attachment {
  url: string
  name: string
  size: string | null
}

interface GalleryImage {
  url: string
  title: string
}

export default function PostForm({ userId, post }: PostFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>(post?.image_url || "")
  const [groups, setGroups] = useState<Array<{ slug: string; name: string }>>([])
  const allowedPostTypes = ["aktualnosci", "ogloszenia", "konkursy", "rada-rodzicow", "okiem-specjalisty"]
  const draftKey = post ? `post-draft-${post.id}` : "post-draft-new"

  const toInputDate = (v: any) => {
    if (!v) return ""
    try {
      const d = typeof v === "string" ? new Date(v) : new Date(v)
      const iso = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString()
      return iso.slice(0, 16)
    } catch {
      return typeof v === "string" ? v : ""
    }
  }

  useEffect(() => {
    ; (async () => {
      try {
        const rows = await getGroupsPublic()
        setGroups((rows || []).map((g: any) => ({ slug: String(g.slug), name: String(g.name) })))
      } catch { }
    })()
  }, [])

  const [formData, setFormData] = useState({
    title: post?.title || "",
    content: post?.content || "",
    excerpt: post?.excerpt || "",
    type: post?.type && allowedPostTypes.includes(post.type) ? post.type : "aktualnosci",
    status: post?.status || "draft",
    image_url: post?.image_url || "",
    add_to_calendar: post?.add_to_calendar || false,
    calendar_date: toInputDate(post?.calendar_date || ""),
    calendar_end_date: toInputDate(post?.calendar_end_date || ""),
    competition_status: post?.competition_status || "",
    competition_start_date: toInputDate(post?.competition_start_date || ""),
    competition_end_date: toInputDate(post?.competition_end_date || ""),
    group_category: post?.group_category || "",
    attachments: (post?.attachments || []).map(a => ({ url: a.file_url, name: a.file_name, size: a.file_size })) as Attachment[],
    gallery_images: (post?.gallery_images || []).map(i => ({ url: i.image_url, title: i.title || "" })) as GalleryImage[],
    images: (post?.images as string[]) || [],
  })

  // Load draft from localStorage
  useEffect(() => {
    const savedDraft = localStorage.getItem(draftKey)
    if (savedDraft && !post) {
      try {
        const draftData = JSON.parse(savedDraft)
        setFormData(prev => ({ ...prev, ...draftData }))
        if (draftData.image_url) setImagePreview(draftData.image_url)
        toast.info("Przywrócono wersję roboczą")
      } catch (err) {
        console.error("Error parsing draft:", err)
      }
    }
  }, [draftKey, post])

  // Auto-save to localStorage
  useEffect(() => {
    if (!post) {
      const timeout = setTimeout(() => {
        const dataToSave = { ...formData }
        // We don't necessarily want to save everything, but most of it
        localStorage.setItem(draftKey, JSON.stringify(dataToSave))
      }, 1000)
      return () => clearTimeout(timeout)
    }
  }, [formData, draftKey, post])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setError("Proszę wybrać plik graficzny")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Plik jest zbyt duży. Maksymalny rozmiar to 5MB")
      return
    }

    setUploading(true)
    setError(null)

    try {
      const optimizedFile = await optimizeImage(file, 1920, 0.85)

      const formData = new FormData()
      formData.append("file", optimizedFile)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        console.error("[v0] Upload failed:", error)
        throw new Error(error.details || "Upload failed")
      }

      const data = await response.json()
      const publicUrl = data.url

      setFormData((prev) => ({ ...prev, image_url: publicUrl }))
      setImagePreview(publicUrl)
    } catch (err) {
      console.error("[v0] Upload error:", err)
      setError(err instanceof Error ? err.message : "Błąd podczas wgrywania pliku")
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setFormData({ ...formData, image_url: "" })
    setImagePreview("")
  }

  const handleAttachmentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setError(null)

    try {
      for (const file of Array.from(files)) {
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`Plik ${file.name} jest zbyt duży (max 10MB)`)
          continue
        }

        const formDataFetch = new FormData()
        formDataFetch.append("file", file)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formDataFetch,
        })

        if (!response.ok) throw new Error("Upload failed")

        const data = await response.json()
        setFormData((prev) => ({
          ...prev,
          attachments: [...prev.attachments, { url: data.url, name: file.name, size: `${(file.size / 1024).toFixed(1)} KB` }],
        }))
      }
      toast.success("Załączniki zostały dodane")
    } catch (err) {
      setError("Błąd podczas wgrywania załączników")
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveAttachment = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }))
  }

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setError(null)

    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue

        const optimizedFile = await optimizeImage(file, 1600, 0.8)
        const formDataFetch = new FormData()
        formDataFetch.append("file", optimizedFile)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formDataFetch,
        })

        if (!response.ok) throw new Error("Upload failed")

        const data = await response.json()
        setFormData((prev) => ({
          ...prev,
          gallery_images: [...prev.gallery_images, { url: data.url, title: "" }],
        }))
      }
      toast.success("Zdjęcia zostały dodane do galerii")
    } catch (err) {
      setError("Błąd podczas wgrywania zdjęć")
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      gallery_images: prev.gallery_images.filter((_, i) => i !== index),
    }))
  }

  const handleAdditionalImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setError(null)

    try {
      const newUrls: string[] = []
      for (const file of Array.from(files)) {
        const optimizedFile = await optimizeImage(file, 1600, 0.8)
        const fData = new FormData()
        fData.append("file", optimizedFile)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: fData,
        })

        if (!response.ok) throw new Error("Upload failed")
        const data = await response.json()
        newUrls.push(data.url)
      }

      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...newUrls],
      }))
      toast.success(`Dodano ${newUrls.length} zdjęć`)
    } catch (err) {
      setError("Błąd podczas wgrywania zdjęć")
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveAdditionalImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const postData = {
      title: formData.title,
      content: formData.content,
      excerpt: formData.excerpt,
      type: formData.type,
      status: formData.status,
      image_url: formData.image_url || null,
      add_to_calendar: formData.add_to_calendar,
      calendar_date: formData.calendar_date || null,
      calendar_end_date: formData.calendar_end_date || null,
      competition_status: formData.type === "konkursy" ? formData.competition_status || null : null,
      competition_start_date: formData.type === "konkursy" ? formData.competition_start_date || null : null,
      competition_end_date: formData.type === "konkursy" ? formData.competition_end_date || null : null,
      group_category: formData.group_category || null,
      user_id: userId,
      published: formData.status === "published",
      attachments: formData.attachments,
      gallery_images: formData.gallery_images,
      images: formData.images,
    }

    try {
      let result
      if (post) {
        result = await updatePost(post.id, postData)
      } else {
        result = await createPost(postData)
      }

      if (!result.success) {
        throw new Error(result.error || "Failed to save post")
      }

      toast.success("Zapisano")
      localStorage.removeItem(draftKey)
      router.push("/admin/posts")
      router.refresh()
    } catch (err) {
      console.error("[v0] Error saving post:", err)
      setError(err instanceof Error ? err.message : "Wystąpił błąd")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border shadow-sm sticky top-0 z-10">
        <div className="flex gap-2">
          <Button
            type="button"
            variant={showPreview ? "outline" : "default"}
            onClick={() => setShowPreview(false)}
            size="sm"
          >
            Edytor
          </Button>
          <Button
            type="button"
            variant={showPreview ? "default" : "outline"}
            onClick={() => setShowPreview(true)}
            size="sm"
          >
            Podgląd na żywo
          </Button>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={() => localStorage.removeItem(draftKey)}>
            Wyczyść szkic
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || uploading} size="sm">
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? "Zapisywanie..." : post ? "Zaktualizuj" : "Opublikuj"}
          </Button>
        </div>
      </div>

      {showPreview ? (
        <Card className="overflow-hidden">
          <div className="bg-gray-50 border-b p-4 text-sm font-medium text-gray-500 uppercase tracking-wider">
            Podgląd wizualny (Widok publiczny)
          </div>
          <CardContent className="p-8 max-w-4xl mx-auto">
            <div className="space-y-8">
              <div className="aspect-video relative rounded-2xl overflow-hidden shadow-lg border">
                {imagePreview ? (
                  <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-gray-300" />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl font-serif font-bold text-gray-900 leading-tight">
                  {formData.title || "Tytuł Twojego postu"}
                </h1>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date().toLocaleDateString("pl-PL")}</span>
                  <span className="mx-2">•</span>
                  <span className="uppercase tracking-wide font-semibold text-blue-600">{formData.type}</span>
                </div>
              </div>

              <article
                className="prose prose-neutral max-w-none"
                dangerouslySetInnerHTML={{ __html: formData.content || "<p class='text-gray-400 italic'>Brak treści postu...</p>" }}
              />

              {formData.images && formData.images.length > 0 && (
                <div className="space-y-6 pt-12 border-t">
                  <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <ImageIcon className="w-6 h-6 text-blue-500" />
                    Galeria zdjęć
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {formData.images.map((img, i) => (
                      <div key={i} className="relative aspect-video rounded-2xl overflow-hidden shadow-md border">
                        <Image src={img} alt="" fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {formData.attachments.length > 0 && (
                <div className="space-y-4 pt-12 border-t">
                  <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <FileText className="w-6 h-6 text-blue-500" />
                    Załączniki
                  </h2>
                  {formData.attachments.map((att, i) => (
                    <div key={i} className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white rounded-xl shadow-sm border">
                          <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{att.name}</p>
                          <p className="text-sm text-gray-500">{att.size}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">POBIERZ</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={handleSubmit}>
          <Card>
            <CardContent className="p-6 space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
              )}

              <div className="grid gap-4">
                <div>
                  <Label htmlFor="title">Tytuł *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="Wprowadź tytuł postu"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Typ *</Label>
                    <select
                      id="type"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="aktualnosci">Aktualność</option>
                      <option value="ogloszenia">Ogłoszenie</option>
                      <option value="konkursy">Konkurs</option>
                      <option value="rada-rodzicow">Rada Rodziców</option>
                      <option value="okiem-specjalisty">Okiem specjalisty</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="status">Status *</Label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="draft">Szkic</option>
                      <option value="published">Opublikowany</option>
                      <option value="archived">Zarchiwizowany</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="group_category">Kategoria grupy (opcjonalnie)</Label>
                  <select
                    id="group_category"
                    value={formData.group_category}
                    onChange={(e) => setFormData({ ...formData, group_category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Brak - post ogólny</option>
                    {groups.map((g) => (
                      <option key={g.slug} value={g.slug}>Grupa {g.name}</option>
                    ))}
                  </select>
                  <p className="text-sm text-gray-500 mt-1">
                    Wybierz grupę, jeśli post ma być widoczny tylko dla tej grupy. Pozostaw puste dla ogólnych postów.
                  </p>
                </div>

                <div>
                  <Label htmlFor="excerpt">Krótki opis</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="Krótki opis postu (wyświetlany na liście)"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="content">Treść *</Label>
                  <RichTextEditor
                    value={formData.content}
                    onChange={(content) => setFormData({ ...formData, content })}
                  />
                </div>

                <div>
                  <Label>Zdjęcie wyróżniające</Label>
                  <div className="space-y-3">
                    {imagePreview && (
                      <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                        <Image src={imagePreview || "/placeholder.svg"} alt="Podgląd" fill className="object-cover" />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <label className="flex-1">
                        <Button type="button" variant="outline" className="w-full bg-transparent" disabled={uploading} asChild>
                          <span>
                            <Upload className="w-4 h-4 mr-2" />
                            {uploading ? "Wgrywanie..." : "Wgraj zdjęcie"}
                          </span>
                        </Button>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                          disabled={uploading}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6 space-y-4">
                  <div>
                    <Label className="text-base font-semibold">Załączniki (Pliki PDF, Doc, itp.)</Label>
                    <div className="mt-2 space-y-2">
                      {formData.attachments.map((att, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-md border text-sm">
                          <div className="flex items-center gap-2 truncate">
                            <FileText className="h-4 w-4 text-blue-500 shrink-0" />
                            <span className="truncate">{att.name}</span>
                            <span className="text-gray-400">({att.size})</span>
                          </div>
                          <button type="button" onClick={() => handleRemoveAttachment(idx)} className="text-red-500 hover:text-red-700">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}

                      <label className="inline-block mt-2">
                        <Button type="button" variant="outline" size="sm" disabled={uploading} asChild>
                          <span>
                            <Paperclip className="h-4 w-4 mr-2" />
                            {uploading ? "Wgrywanie..." : "Dodaj załącznik"}
                          </span>
                        </Button>
                        <input type="file" onChange={handleAttachmentUpload} className="hidden" multiple disabled={uploading} />
                      </label>
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-semibold">Galeria zdjęć pod postem</Label>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                      {formData.gallery_images.map((img, idx) => (
                        <div key={idx} className="relative group aspect-square rounded-md overflow-hidden border bg-gray-100">
                          <Image src={img.url} alt={`Gallery image ${idx}`} fill className="object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button type="button" onClick={() => handleRemoveGalleryImage(idx)} className="bg-red-500 text-white p-1.5 rounded-full">
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}

                      <label className="border-2 border-dashed rounded-md aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                        <Plus className="h-8 w-8 text-gray-400" />
                        <span className="text-xs text-gray-500 mt-1">Dodaj zdjęcia</span>
                        <input type="file" accept="image/*" onChange={handleGalleryUpload} className="hidden" multiple disabled={uploading} />
                      </label>
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-semibold">Dodatkowe zdjęcia w poście (Mini-galeria)</Label>
                    <p className="text-sm text-gray-500 mb-4">Zdjęcia wyświetlane pod treścią artykułu w pełnej szerokości.</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {(formData.images || []).map((img, idx) => (
                        <div key={idx} className="relative group aspect-video rounded-xl overflow-hidden border shadow-sm">
                          <Image src={img} alt={`Image ${idx}`} fill className="object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button type="button" onClick={() => handleRemoveAdditionalImage(idx)} className="bg-red-500 text-white p-2 rounded-full transform scale-90 group-hover:scale-100 transition-transform">
                              <X className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                      <label className="border-2 border-dashed rounded-xl aspect-video flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-all group">
                        <div className="p-3 rounded-full bg-gray-50 group-hover:bg-blue-100 transition-colors">
                          <Upload className="h-6 w-6 text-gray-400 group-hover:text-blue-500" />
                        </div>
                        <span className="text-sm font-medium text-gray-500 group-hover:text-blue-600 mt-2">Wgraj zdjęcia</span>
                        <input type="file" accept="image/*" onChange={handleAdditionalImagesUpload} className="hidden" multiple disabled={uploading} />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    id="add_to_calendar"
                    checked={formData.add_to_calendar}
                    onChange={(e) => setFormData({ ...formData, add_to_calendar: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <Label htmlFor="add_to_calendar" className="cursor-pointer">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Dodaj do kalendarza
                  </Label>
                </div>

                {formData.add_to_calendar && (
                  <div className="grid md:grid-cols-2 gap-4 ml-6">
                    <div>
                      <Label htmlFor="calendar_date">Data rozpoczęcia</Label>
                      <Input
                        type="datetime-local"
                        id="calendar_date"
                        value={formData.calendar_date}
                        onChange={(e) => setFormData({ ...formData, calendar_date: e.target.value })}
                        required={formData.add_to_calendar}
                      />
                    </div>
                    <div>
                      <Label htmlFor="calendar_end_date">Data zakończenia (opcjonalnie)</Label>
                      <Input
                        type="datetime-local"
                        id="calendar_end_date"
                        value={formData.calendar_end_date}
                        onChange={(e) => setFormData({ ...formData, calendar_end_date: e.target.value })}
                      />
                    </div>
                  </div>
                )}
              </div>

              {formData.type === "konkursy" && (
                <div className="border-t pt-6">
                  <h3 className="font-medium text-gray-900 mb-4">Ustawienia konkursu</h3>
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="competition_status">Status konkursu</Label>
                      <select
                        id="competition_status"
                        value={formData.competition_status}
                        onChange={(e) => setFormData({ ...formData, competition_status: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Wybierz status</option>
                        <option value="upcoming">Nadchodzący</option>
                        <option value="ongoing">Trwa</option>
                        <option value="completed">Zakończony</option>
                      </select>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="competition_start_date">Data rozpoczęcia konkursu</Label>
                        <Input
                          type="datetime-local"
                          id="competition_start_date"
                          value={formData.competition_start_date}
                          onChange={(e) => setFormData({ ...formData, competition_start_date: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="competition_end_date">Data zakończenia konkursu</Label>
                        <Input
                          type="datetime-local"
                          id="competition_end_date"
                          value={formData.competition_end_date}
                          onChange={(e) => setFormData({ ...formData, competition_end_date: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-6 border-t">
                <Button type="submit" disabled={isLoading}>
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? "Zapisywanie..." : post ? "Zaktualizuj post" : "Utwórz post"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Anuluj
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      )}
    </div>
  )
}
