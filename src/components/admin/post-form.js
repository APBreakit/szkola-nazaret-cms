"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { optimizeImage } from "@/lib/utils/image-optimizer";
import { getGroupsPublic } from "@/app/actions/public-actions";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPost, updatePost } from "@/app/actions/admin-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Save, Upload, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
export default function PostForm({ userId, post }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState(post?.image_url || "");
    const [groups, setGroups] = useState([]);
    const toInputDate = (v) => {
        if (!v)
            return "";
        try {
            const d = typeof v === "string" ? new Date(v) : new Date(v);
            const iso = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString();
            return iso.slice(0, 16);
        }
        catch {
            return typeof v === "string" ? v : "";
        }
    };
    useEffect(() => {
        ;
        (async () => {
            try {
                const rows = await getGroupsPublic();
                setGroups((rows || []).map((g) => ({ slug: String(g.slug), name: String(g.name) })));
            }
            catch { }
        })();
    }, []);
    const [formData, setFormData] = useState({
        title: post?.title || "",
        content: post?.content || "",
        excerpt: post?.excerpt || "",
        type: post?.type === "aktualnosci"
            ? "aktualnosci"
            : post?.type === "ogloszenia"
                ? "ogloszenia"
                : post?.type === "konkursy"
                    ? "konkursy"
                    : post?.type || "aktualnosci",
        status: post?.status || "draft",
        image_url: post?.image_url || "",
        add_to_calendar: post?.add_to_calendar || false,
        calendar_date: toInputDate(post?.calendar_date || ""),
        calendar_end_date: toInputDate(post?.calendar_end_date || ""),
        competition_status: post?.competition_status || "",
        competition_start_date: toInputDate(post?.competition_start_date || ""),
        competition_end_date: toInputDate(post?.competition_end_date || ""),
        group_category: post?.group_category || "",
    });
    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        if (!file.type.startsWith("image/")) {
            setError("Proszę wybrać plik graficzny");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError("Plik jest zbyt duży. Maksymalny rozmiar to 5MB");
            return;
        }
        setUploading(true);
        setError(null);
        try {
            console.log("[v0] Starting image upload:", file.name);
            const optimizedFile = await optimizeImage(file, 1920, 0.85);
            console.log("[v0] Image optimized, uploading to Vercel Blob");
            const formData = new FormData();
            formData.append("file", optimizedFile);
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            if (!response.ok) {
                const error = await response.json();
                console.error("[v0] Upload failed:", error);
                throw new Error(error.details || "Upload failed");
            }
            const data = await response.json();
            const publicUrl = data.url;
            console.log("[v0] Upload successful:", publicUrl);
            setFormData((prev) => ({ ...prev, image_url: publicUrl }));
            setImagePreview(publicUrl);
        }
        catch (err) {
            console.error("[v0] Upload error:", err);
            setError(err instanceof Error ? err.message : "Błąd podczas wgrywania pliku");
        }
        finally {
            setUploading(false);
        }
    };
    const handleRemoveImage = () => {
        setFormData({ ...formData, image_url: "" });
        setImagePreview("");
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        console.log("[v0] Submitting post with data:", formData);
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
        };
        try {
            let result;
            if (post) {
                console.log("[v0] Updating post:", post.id);
                result = await updatePost(post.id, postData);
            }
            else {
                console.log("[v0] Creating new post");
                result = await createPost(postData);
            }
            if (!result.success) {
                throw new Error(result.error || "Failed to save post");
            }
            console.log("[v0] Post saved successfully");
            toast.success("Zapisano");
            router.push("/admin/posts");
            router.refresh();
        }
        catch (err) {
            console.error("[v0] Error saving post:", err);
            setError(err instanceof Error ? err.message : "Wystąpił błąd");
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsx("form", { onSubmit: handleSubmit, children: _jsx(Card, { children: _jsxs(CardContent, { className: "p-6 space-y-6", children: [error && (_jsx("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm", children: error })), _jsxs("div", { className: "grid gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "title", children: "Tytu\u0142 *" }), _jsx(Input, { id: "title", value: formData.title, onChange: (e) => setFormData({ ...formData, title: e.target.value }), required: true, placeholder: "Wprowad\u017A tytu\u0142 postu" })] }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "type", children: "Typ *" }), _jsxs("select", { id: "type", value: formData.type, onChange: (e) => setFormData({ ...formData, type: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", required: true, children: [_jsx("option", { value: "aktualnosci", children: "Aktualno\u015B\u0107" }), _jsx("option", { value: "ogloszenia", children: "Og\u0142oszenie" }), _jsx("option", { value: "konkursy", children: "Konkurs" }), _jsx("option", { value: "rada-rodzicow", children: "Rada Rodzic\u00F3w" })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "status", children: "Status *" }), _jsxs("select", { id: "status", value: formData.status, onChange: (e) => setFormData({ ...formData, status: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", required: true, children: [_jsx("option", { value: "draft", children: "Szkic" }), _jsx("option", { value: "published", children: "Opublikowany" }), _jsx("option", { value: "archived", children: "Zarchiwizowany" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "group_category", children: "Kategoria grupy (opcjonalnie)" }), _jsxs("select", { id: "group_category", value: formData.group_category, onChange: (e) => setFormData({ ...formData, group_category: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "", children: "Brak - post og\u00F3lny" }), groups.map((g) => (_jsxs("option", { value: g.slug, children: ["Grupa ", g.name] }, g.slug)))] }), _jsx("p", { className: "text-sm text-gray-500 mt-1", children: "Wybierz grup\u0119, je\u015Bli post ma by\u0107 widoczny tylko dla tej grupy. Pozostaw puste dla og\u00F3lnych post\u00F3w." })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "excerpt", children: "Kr\u00F3tki opis" }), _jsx(Textarea, { id: "excerpt", value: formData.excerpt, onChange: (e) => setFormData({ ...formData, excerpt: e.target.value }), placeholder: "Kr\u00F3tki opis postu (wy\u015Bwietlany na li\u015Bcie)", rows: 2 })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "content", children: "Tre\u015B\u0107 *" }), _jsx(Textarea, { id: "content", value: formData.content, onChange: (e) => setFormData({ ...formData, content: e.target.value }), required: true, placeholder: "Pe\u0142na tre\u015B\u0107 postu", rows: 10 })] }), _jsxs("div", { children: [_jsx(Label, { children: "Zdj\u0119cie" }), _jsxs("div", { className: "space-y-3", children: [imagePreview && (_jsxs("div", { className: "relative w-full h-48 rounded-lg overflow-hidden border border-gray-200", children: [_jsx(Image, { src: imagePreview || "/placeholder.svg", alt: "Podgl\u0105d", fill: true, className: "object-cover" }), _jsx("button", { type: "button", onClick: handleRemoveImage, className: "absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition", children: _jsx(X, { className: "w-4 h-4" }) })] })), _jsx("div", { className: "flex gap-3", children: _jsxs("label", { className: "flex-1", children: [_jsx(Button, { type: "button", variant: "outline", className: "w-full bg-transparent", disabled: uploading, asChild: true, children: _jsxs("span", { children: [_jsx(Upload, { className: "w-4 h-4 mr-2" }), uploading ? "Wgrywanie..." : "Wgraj zdjęcie"] }) }), _jsx("input", { type: "file", accept: "image/*", onChange: handleFileUpload, className: "hidden", disabled: uploading })] }) }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "image_url", children: "Lub wklej URL zdj\u0119cia" }), _jsx(Input, { id: "image_url", value: formData.image_url, onChange: (e) => {
                                                            setFormData({ ...formData, image_url: e.target.value });
                                                            setImagePreview(e.target.value);
                                                        }, placeholder: "https://example.com/image.jpg" })] })] })] })] }), _jsxs("div", { className: "border-t pt-6", children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx("input", { type: "checkbox", id: "add_to_calendar", checked: formData.add_to_calendar, onChange: (e) => setFormData({ ...formData, add_to_calendar: e.target.checked }), className: "w-4 h-4 text-blue-600 rounded" }), _jsxs(Label, { htmlFor: "add_to_calendar", className: "cursor-pointer", children: [_jsx(Calendar, { className: "w-4 h-4 inline mr-2" }), "Dodaj do kalendarza"] })] }), formData.add_to_calendar && (_jsxs("div", { className: "grid md:grid-cols-2 gap-4 ml-6", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "calendar_date", children: "Data rozpocz\u0119cia" }), _jsx(Input, { type: "datetime-local", id: "calendar_date", value: formData.calendar_date, onChange: (e) => setFormData({ ...formData, calendar_date: e.target.value }), required: formData.add_to_calendar })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "calendar_end_date", children: "Data zako\u0144czenia (opcjonalnie)" }), _jsx(Input, { type: "datetime-local", id: "calendar_end_date", value: formData.calendar_end_date, onChange: (e) => setFormData({ ...formData, calendar_end_date: e.target.value }) })] })] }))] }), formData.type === "konkursy" && (_jsxs("div", { className: "border-t pt-6", children: [_jsx("h3", { className: "font-medium text-gray-900 mb-4", children: "Ustawienia konkursu" }), _jsxs("div", { className: "grid gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "competition_status", children: "Status konkursu" }), _jsxs("select", { id: "competition_status", value: formData.competition_status, onChange: (e) => setFormData({ ...formData, competition_status: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "", children: "Wybierz status" }), _jsx("option", { value: "upcoming", children: "Nadchodz\u0105cy" }), _jsx("option", { value: "ongoing", children: "Trwa" }), _jsx("option", { value: "completed", children: "Zako\u0144czony" })] })] }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "competition_start_date", children: "Data rozpocz\u0119cia konkursu" }), _jsx(Input, { type: "datetime-local", id: "competition_start_date", value: formData.competition_start_date, onChange: (e) => setFormData({ ...formData, competition_start_date: e.target.value }) })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "competition_end_date", children: "Data zako\u0144czenia konkursu" }), _jsx(Input, { type: "datetime-local", id: "competition_end_date", value: formData.competition_end_date, onChange: (e) => setFormData({ ...formData, competition_end_date: e.target.value }) })] })] })] })] })), _jsxs("div", { className: "flex gap-4 pt-6 border-t", children: [_jsxs(Button, { type: "submit", disabled: isLoading, children: [_jsx(Save, { className: "w-4 h-4 mr-2" }), isLoading ? "Zapisywanie..." : post ? "Zaktualizuj post" : "Utwórz post"] }), _jsx(Button, { type: "button", variant: "outline", onClick: () => router.back(), children: "Anuluj" })] })] }) }) }));
}
