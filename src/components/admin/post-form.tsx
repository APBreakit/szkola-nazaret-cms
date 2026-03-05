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
import { Calendar, Save, Upload, X } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

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
    group_category: string | null // Added group_category field
  }
}

export default function PostForm({ userId, post }: PostFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>(post?.image_url || "")
  const [groups, setGroups] = useState<Array<{ slug: string; name: string }>>([])
  const allowedPostTypes = ["aktualnosci", "ogloszenia", "konkursy", "rada-rodzicow", "okiem-specjalisty"]

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
    ;(async () => {
      try {
        const rows = await getGroupsPublic()
        setGroups((rows || []).map((g: any) => ({ slug: String(g.slug), name: String(g.name) })))
      } catch {}
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
  })

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
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                placeholder="Pełna treść postu"
                rows={10}
              />
            </div>

            <div>
              <Label>Zdjęcie</Label>
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
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full bg-transparent"
                      disabled={uploading}
                      asChild
                    >
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

                <div>
                  <Label htmlFor="image_url">Lub wklej URL zdjęcia</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => {
                      setFormData({ ...formData, image_url: e.target.value })
                      setImagePreview(e.target.value)
                    }}
                    placeholder="https://example.com/image.jpg"
                  />
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
                    required={formData.add_to_calendar} // Make required if added to calendar
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
  )
}
