"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Image from "next/image";
import { Upload, X, FileText } from "lucide-react";
import { optimizeImage } from "@/lib/utils/image-optimizer";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createGallery, updateGallery, getGalleryCategories, getMediaFiles } from "@/app/actions/admin-actions";
import { getGroupsPublic } from "@/app/actions/public-actions";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
export default function GalleryForm({ gallery, userId }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState(gallery?.cover_image_url || "");
    const [galleryImages, setGalleryImages] = useState([]);
    const [uploadingGallery, setUploadingGallery] = useState(false);
    const [categories, setCategories] = useState([]);
    const [groups, setGroups] = useState([]);
    const [groupSlug, setGroupSlug] = useState("");
    const [showMediaPicker, setShowMediaPicker] = useState(false);
    const [existingMedia, setExistingMedia] = useState([]);
    const [loadingMedia, setLoadingMedia] = useState(false);
    const [formData, setFormData] = useState({
        title: gallery?.title || "",
        slug: gallery?.slug || "",
        description: gallery?.description || "",
        categories: gallery?.categories || (gallery?.category ? [gallery.category] : ["inne"]),
        cover_image_url: gallery?.cover_image_url || "",
        status: gallery?.status || "draft",
    });
    useEffect(() => {
        const loadExistingMedia = async () => {
            if (!showMediaPicker)
                return;
            setLoadingMedia(true);
            try {
                const rows = await getMediaFiles();
                const normalized = (rows || []).filter((m) => (m.file_type || '').toLowerCase() === 'image').map((m) => ({
                    id: m.id,
                    file_url: m.file_url || m.image_url || m.url,
                    file_name: m.file_name || 'plik',
                    created_at: m.created_at || new Date().toISOString(),
                }));
                setExistingMedia(normalized);
            }
            catch (error) {
                console.error("[v0] Error loading media:", error);
            }
            finally {
                setLoadingMedia(false);
            }
        };
        loadExistingMedia();
    }, [showMediaPicker]);
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const rows = await getGalleryCategories();
                setCategories(rows);
            }
            catch (e) { }
        };
        loadCategories();
        (async () => {
            try {
                const rows = await getGroupsPublic();
                setGroups((rows || []).map((g) => ({ slug: String(g.slug), name: String(g.name) })));
            }
            catch { }
        })();
    }, []);
    const generateSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/ą/g, "a")
            .replace(/ć/g, "c")
            .replace(/ę/g, "e")
            .replace(/ł/g, "l")
            .replace(/ń/g, "n")
            .replace(/ó/g, "o")
            .replace(/ś/g, "s")
            .replace(/ź|ż/g, "z")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    };
    const handleTitleChange = (title) => {
        setFormData((prev) => ({
            ...prev,
            title,
            slug: gallery ? prev.slug : generateSlug(title),
        }));
    };
    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        if (!file.type.startsWith("image/")) {
            alert("Proszę wybrać plik graficzny");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert("Plik jest zbyt duży. Maksymalny rozmiar to 5MB");
            return;
        }
        setUploading(true);
        try {
            console.log("[v0] Starting cover image upload:", file.name);
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
            setFormData((prev) => ({ ...prev, cover_image_url: publicUrl }));
            setImagePreview(publicUrl);
        }
        catch (err) {
            console.error("[v0] Upload error:", err);
            alert(err instanceof Error ? err.message : "Błąd podczas wgrywania pliku");
        }
        finally {
            setUploading(false);
        }
    };
    const handleGalleryImagesUpload = async (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0)
            return;
        console.log("[v0] Starting gallery images upload:", files.length, "files");
        const validFiles = files.filter((file) => {
            if (!file.type.startsWith("image/")) {
                alert(`${file.name} nie jest plikiem graficznym`);
                return false;
            }
            if (file.size > 5 * 1024 * 1024) {
                alert(`${file.name} jest zbyt duży. Maksymalny rozmiar to 5MB`);
                return false;
            }
            return true;
        });
        if (validFiles.length === 0)
            return;
        const optimizedPromises = validFiles.map(async (file) => {
            const optimized = await optimizeImage(file, 1920, 0.85);
            return {
                url: URL.createObjectURL(optimized),
                file: optimized,
                title: file.name,
            };
        });
        const newPreviews = await Promise.all(optimizedPromises);
        console.log("[v0] Gallery images optimized and ready");
        setGalleryImages((prev) => [...prev, ...newPreviews]);
    };
    const handleSelectExistingMedia = (mediaUrl) => {
        if (galleryImages.some((img) => img.url === mediaUrl)) {
            alert("To zdjęcie już zostało dodane");
            return;
        }
        setGalleryImages((prev) => [...prev, { url: mediaUrl }]);
    };
    const removeGalleryImage = (index) => {
        setGalleryImages((prev) => {
            const newImages = [...prev];
            if (newImages[index].url.startsWith("blob:")) {
                URL.revokeObjectURL(newImages[index].url);
            }
            newImages.splice(index, 1);
            return newImages;
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Prepare images array for gallery creation
            const imagesForGallery = [];
            if (galleryImages.length > 0) {
                setUploadingGallery(true);
                console.log("[v0] Uploading", galleryImages.length, "gallery images");
                for (const imageData of galleryImages) {
                    try {
                        let imageUrl = imageData.url;
                        // If it's a new file (blob URL), upload it first
                        if (imageData.file) {
                            const formData = new FormData();
                            formData.append("file", imageData.file);
                            const response = await fetch("/api/upload", {
                                method: "POST",
                                body: formData,
                            });
                            if (!response.ok) {
                                console.error("[v0] Error uploading image file");
                                continue;
                            }
                            const data = await response.json();
                            imageUrl = data.url;
                            console.log("[v0] Image uploaded:", imageUrl);
                        }
                        imagesForGallery.push({
                            url: imageUrl,
                            title: imageData.title || null,
                        });
                    }
                    catch (error) {
                        console.error("[v0] Error processing image:", error);
                        continue;
                    }
                }
                setUploadingGallery(false);
            }
            let result;
            if (gallery) {
                result = await updateGallery(gallery.id, {
                    ...formData,
                    categories: Array.from(new Set([...formData.categories, ...(groupSlug ? ["grupa-" + groupSlug] : [])])),
                });
            }
            else {
                result = await createGallery({
                    ...formData,
                    category: groupSlug ? "grupa-" + groupSlug : formData.category,
                    categories: Array.from(new Set([...formData.categories, ...(groupSlug ? ["grupa-" + groupSlug] : [])])),
                    created_by: userId,
                }, imagesForGallery);
            }
            if (!result.success) {
                throw new Error(result.error);
            }
            toast.success("Zapisano");
            router.push("/admin/galleries");
            router.refresh();
        }
        catch (err) {
            console.error("[v0] Error saving gallery:", err);
            alert(err instanceof Error ? err.message : "Błąd podczas zapisywania galerii");
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "title", children: "Tytu\u0142 galerii *" }), _jsx(Input, { id: "title", value: formData.title, onChange: (e) => handleTitleChange(e.target.value), required: true, placeholder: "np. Wycieczka do zoo" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "slug", children: "Slug (URL)" }), _jsx(Input, { id: "slug", value: formData.slug, onChange: (e) => setFormData({ ...formData, slug: e.target.value }), required: true, placeholder: "wycieczka-do-zoo" }), _jsx("p", { className: "text-sm text-gray-600 mt-1", children: "Adres URL galerii (generowany automatycznie)" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "description", children: "Opis" }), _jsx(Textarea, { id: "description", value: formData.description, onChange: (e) => setFormData({ ...formData, description: e.target.value }), placeholder: "Kr\u00F3tki opis galerii...", rows: 3 })] }), _jsxs("div", { children: [_jsx(Label, { children: "Kategorie *" }), _jsx("div", { className: "grid grid-cols-2 gap-2 mt-2", children: (categories.length > 0 ? categories : [
                            { id: 'wydarzenia', name: 'Wydarzenia', slug: 'wydarzenia', visible: true },
                            { id: 'szkoła', name: 'Katolicka Szkoła Podstawowa', slug: 'szkoła', visible: true },
                            { id: 'sale', name: 'Sale', slug: 'sale', visible: true },
                            { id: 'zajecia', name: 'Zajęcia', slug: 'zajecia', visible: true },
                            { id: 'zajecia-tematyczne', name: 'Zajęcia tematyczne', slug: 'zajecia-tematyczne', visible: true },
                            { id: 'inne', name: 'Inne', slug: 'inne', visible: true },
                        ]).map((c) => (_jsxs("label", { className: "flex items-center gap-2 text-sm", children: [_jsx("input", { type: "checkbox", checked: formData.categories.includes(c.slug), onChange: (e) => {
                                        const checked = e.target.checked;
                                        const current = formData.categories || [];
                                        const next = checked ? Array.from(new Set([...current, c.slug])) : current.filter((x) => x !== c.slug);
                                        setFormData({ ...formData, categories: next });
                                    } }), c.name] }, c.slug))) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Powi\u0105\u017C z grup\u0105 (opcjonalnie)" }), _jsxs("select", { value: groupSlug, onChange: (e) => setGroupSlug(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: [_jsx("option", { value: "", children: "Brak" }), groups.map((g) => (_jsxs("option", { value: g.slug, children: ["Grupa ", g.name] }, g.slug)))] }), _jsxs("p", { className: "text-xs text-gray-500 mt-1", children: ["Wybranie grupy doda kategori\u0119 \u201Egrupa-", groupSlug, "\u201D i umo\u017Cliwi wy\u015Bwietlenie galerii na stronie grupy."] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Zdj\u0119cie ok\u0142adki" }), _jsxs("div", { className: "space-y-3", children: [imagePreview && (_jsx("div", { className: "relative w-full h-48 rounded-lg overflow-hidden border border-gray-200", children: _jsx(Image, { src: imagePreview || "/placeholder.svg", alt: "Podgl\u0105d", fill: true, className: "object-cover" }) })), _jsxs("label", { children: [_jsx(Button, { type: "button", variant: "outline", className: "w-full bg-transparent", disabled: uploading, asChild: true, children: _jsxs("span", { children: [_jsx(Upload, { className: "w-4 h-4 mr-2" }), uploading ? "Wgrywanie..." : "Wgraj zdjęcie"] }) }), _jsx("input", { type: "file", accept: "image/*", onChange: handleFileUpload, className: "hidden", disabled: uploading })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "cover_image_url", children: "Lub wklej URL zdj\u0119cia" }), _jsx(Input, { id: "cover_image_url", value: formData.cover_image_url, onChange: (e) => {
                                            setFormData({ ...formData, cover_image_url: e.target.value });
                                            setImagePreview(e.target.value);
                                        }, placeholder: "https://..." })] })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Zdj\u0119cia galerii" }), _jsx("p", { className: "text-sm text-gray-600 mb-3", children: "Dodaj nowe zdj\u0119cia do galerii" }), galleryImages.length > 0 && (_jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-4", children: galleryImages.map((image, index) => (_jsxs("div", { className: "relative group", children: [_jsx("div", { className: "relative w-full h-32 rounded-lg overflow-hidden border border-gray-200", children: _jsx(Image, { src: image.url || "/placeholder.svg", alt: `Zdjęcie ${index + 1}`, fill: true, className: "object-cover" }) }), _jsx("button", { type: "button", onClick: () => removeGalleryImage(index), className: "absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity", children: _jsx(X, { className: "w-4 h-4" }) })] }, index))) })), _jsxs("div", { className: "flex gap-2", children: [_jsxs("label", { className: "flex-1", children: [_jsx(Button, { type: "button", variant: "outline", className: "w-full bg-transparent", disabled: uploadingGallery, asChild: true, children: _jsxs("span", { children: [_jsx(Upload, { className: "w-4 h-4 mr-2" }), uploadingGallery ? "Wgrywanie..." : "Wgraj nowe zdjęcia"] }) }), _jsx("input", { type: "file", accept: "image/*", multiple: true, onChange: handleGalleryImagesUpload, className: "hidden", disabled: uploadingGallery })] }), _jsxs(Button, { type: "button", variant: "outline", onClick: () => setShowMediaPicker(true), disabled: uploadingGallery, className: "flex-1", children: [_jsx(FileText, { className: "w-4 h-4 mr-2" }), "Wybierz z biblioteki"] })] }), _jsx("p", { className: "text-xs text-gray-500 mt-2", children: "Mo\u017Cesz wgra\u0107 nowe zdj\u0119cia lub wybra\u0107 z ju\u017C dodanych. Maksymalny rozmiar pojedynczego pliku: 5MB" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "status", children: "Status *" }), _jsxs("select", { id: "status", value: formData.status, onChange: (e) => setFormData({ ...formData, status: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", required: true, children: [_jsx("option", { value: "draft", children: "Szkic" }), _jsx("option", { value: "published", children: "Opublikowana" })] })] }), _jsxs("div", { className: "flex gap-3", children: [_jsxs(Button, { type: "submit", disabled: loading, children: [loading && _jsx(Loader2, { className: "w-4 h-4 mr-2 animate-spin" }), gallery ? "Zapisz zmiany" : "Utwórz galerię"] }), _jsx(Button, { type: "button", variant: "outline", onClick: () => router.back(), disabled: loading, children: "Anuluj" })] }), showMediaPicker && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col", children: [_jsxs("div", { className: "p-4 border-b flex items-center justify-between", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Wybierz zdj\u0119cia z biblioteki" }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => setShowMediaPicker(false), children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsx("div", { className: "flex-1 overflow-y-auto p-4", children: loadingMedia ? (_jsx("div", { className: "flex items-center justify-center py-12", children: _jsx(Loader2, { className: "w-8 h-8 animate-spin text-gray-400" }) })) : existingMedia.length === 0 ? (_jsx("div", { className: "text-center py-12 text-gray-500", children: _jsx("p", { children: "Brak zdj\u0119\u0107 w bibliotece" }) })) : (_jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: existingMedia.map((media) => (_jsxs("button", { type: "button", onClick: () => {
                                        handleSelectExistingMedia(media.file_url);
                                        setShowMediaPicker(false);
                                    }, className: "relative group aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-500 transition-colors", children: [_jsx(Image, { src: media.file_url || "/placeholder.svg", alt: media.file_name, fill: true, className: "object-cover" }), _jsx("div", { className: "absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center", children: _jsx("span", { className: "text-white opacity-0 group-hover:opacity-100 text-sm font-medium", children: "Wybierz" }) })] }, media.id))) })) })] }) }))] }));
}
