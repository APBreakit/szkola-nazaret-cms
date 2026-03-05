"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createMedia } from "@/app/actions/admin-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import { optimizeImage } from "@/lib/utils/image-optimizer";
import { toast } from "sonner";
export default function MediaUpload({ userId = 'system', defaultCategory = 'gallery', defaultSubcategory = 'wydarzenia' }) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [fileUrl, setFileUrl] = useState("");
    const [filePreview, setFilePreview] = useState(null);
    const [formData, setFormData] = useState({
        filename: "",
        file_type: "image",
        category: defaultCategory,
        subcategory: defaultSubcategory,
        alt_text: "",
    });
    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        const allowedDocs = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "text/plain",
        ];
        const isImage = file.type.startsWith("image/");
        const isAllowedDoc = allowedDocs.includes(file.type);
        if (!isImage && !isAllowedDoc) {
            setError("Nieobsługiwany typ pliku");
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            setError("Plik jest zbyt duży. Maksymalny rozmiar to 10MB");
            return;
        }
        setUploading(true);
        setError(null);
        try {
            console.log("[v0] Starting file upload:", file.name, file.type);
            let fileToUpload = file;
            if (isImage) {
                console.log("[v0] Optimizing image before upload");
                fileToUpload = await optimizeImage(file, 1920, 0.85);
            }
            const formData = new FormData();
            formData.append("file", fileToUpload);
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
            setFileUrl(publicUrl);
            if (isImage) {
                setFilePreview(publicUrl);
            }
            setFormData((prev) => ({
                ...prev,
                filename: file.name,
                file_type: isImage ? "image" : file.type === "application/pdf" ? "pdf" : "document",
            }));
        }
        catch (err) {
            console.error("[v0] Upload error:", err);
            setError(err instanceof Error ? err.message : "Błąd podczas wgrywania pliku");
        }
        finally {
            setUploading(false);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            const result = await createMedia({
                file_name: formData.filename,
                file_url: fileUrl,
                file_type: formData.file_type,
                category: formData.category,
                subcategory: formData.category === "gallery" ? formData.subcategory : null,
                uploaded_by: userId,
            });
            if (!result.success)
                throw new Error(result.error);
            toast.success("Plik dodany");
            setIsOpen(false);
            setFileUrl("");
            setFilePreview(null);
            setFormData({
                filename: "",
                file_type: "image",
                category: defaultCategory,
                subcategory: defaultSubcategory,
                alt_text: "",
            });
            router.refresh();
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Wystąpił błąd");
        }
        finally {
            setIsLoading(false);
        }
    };
    if (!isOpen) {
        return (_jsxs(Button, { onClick: () => setIsOpen(true), children: [_jsx(Upload, { className: "w-4 h-4 mr-2" }), "Dodaj plik"] }));
    }
    return (_jsx(Card, { children: _jsxs(CardContent, { className: "p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Dodaj nowy plik" }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => setIsOpen(false), children: _jsx(X, { className: "w-4 h-4" }) })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [error && (_jsx("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm", children: error })), _jsxs("div", { children: [_jsx(Label, { children: "Wgraj plik z komputera" }), _jsxs("div", { className: "space-y-3", children: [filePreview && (_jsx("div", { className: "relative w-full h-48 rounded-lg overflow-hidden border border-gray-200", children: _jsx(Image, { src: filePreview || "/placeholder.svg", alt: "Podgl\u0105d", fill: true, className: "object-cover" }) })), _jsxs("label", { children: [_jsx(Button, { type: "button", variant: "outline", className: "w-full bg-transparent", disabled: uploading, asChild: true, children: _jsxs("span", { children: [_jsx(Upload, { className: "w-4 h-4 mr-2" }), uploading ? "Wgrywanie..." : "Wybierz plik"] }) }), _jsx("input", { type: "file", onChange: handleFileUpload, className: "hidden", disabled: uploading, accept: "image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt" })] })] })] }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-0 flex items-center", children: _jsx("span", { className: "w-full border-t" }) }), _jsx("div", { className: "relative flex justify-center text-xs uppercase", children: _jsx("span", { className: "bg-white px-2 text-gray-500", children: "Lub" }) })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "file_url", children: "Wklej URL pliku" }), _jsx(Input, { id: "file_url", value: fileUrl, onChange: (e) => setFileUrl(e.target.value), placeholder: "https://example.com/file.jpg" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "filename", children: "Nazwa pliku *" }), _jsx(Input, { id: "filename", value: formData.filename, onChange: (e) => setFormData({ ...formData, filename: e.target.value }), required: true, placeholder: "moje-zdjecie.jpg" })] }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "file_type", children: "Typ pliku *" }), _jsxs("select", { id: "file_type", value: formData.file_type, onChange: (e) => setFormData({ ...formData, file_type: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", required: true, children: [_jsx("option", { value: "image", children: "Zdj\u0119cie" }), _jsx("option", { value: "pdf", children: "PDF" }), _jsx("option", { value: "document", children: "Dokument" })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "category", children: "Kategoria *" }), _jsxs("select", { id: "category", value: formData.category, onChange: (e) => setFormData({ ...formData, category: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", required: true, children: [_jsx("option", { value: "gallery", children: "Galeria" }), _jsx("option", { value: "document", children: "Dokument" }), _jsx("option", { value: "menu", children: "Jad\u0142ospis" }), _jsx("option", { value: "post", children: "Post" })] })] })] }), formData.category === "gallery" && (_jsxs("div", { children: [_jsx(Label, { htmlFor: "subcategory", children: "Podkategoria galerii *" }), _jsxs("select", { id: "subcategory", value: formData.subcategory, onChange: (e) => setFormData({ ...formData, subcategory: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", required: true, children: [_jsx("option", { value: "wydarzenia", children: "Wydarzenia" }), _jsx("option", { value: "szkoła", children: "Katolicka Szkoła Podstawowa" }), _jsx("option", { value: "sale", children: "Sale" }), _jsx("option", { value: "zajecia", children: "Zaj\u0119cia" }), _jsx("option", { value: "zajecia-tematyczne", children: "Zaj\u0119cia tematyczne" }), _jsx("option", { value: "rada-rodzicow", children: "Rada Rodzic\u00F3w" }), _jsx("option", { value: "rada-rodzicow-wazne", children: "Rada Rodzic\u00F3w \u2013 Wa\u017Cne" })] })] })), _jsxs("div", { children: [_jsx(Label, { htmlFor: "alt_text", children: "Tekst alternatywny (dla zdj\u0119\u0107)" }), _jsx(Input, { id: "alt_text", value: formData.alt_text, onChange: (e) => setFormData({ ...formData, alt_text: e.target.value }), placeholder: "Opis zdj\u0119cia dla czytnik\u00F3w ekranu" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { type: "submit", disabled: isLoading, children: isLoading ? "Dodawanie..." : "Dodaj plik" }), _jsx(Button, { type: "button", variant: "outline", onClick: () => setIsOpen(false), children: "Anuluj" })] })] })] }) }));
}
