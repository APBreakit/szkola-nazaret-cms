"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import Link from "next/link";
import { Edit, Trash2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteGallery } from "@/app/actions/admin-actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
export default function GalleriesTable({ galleries }) {
    const router = useRouter();
    const [deleting, setDeleting] = useState(null);
    const handleDelete = async (id) => {
        if (!confirm("Czy na pewno chcesz usunąć tę galerię?"))
            return;
        setDeleting(id);
        const result = await deleteGallery(id);
        if (!result.success) {
            console.error("Error deleting gallery:", result.error);
            toast.error("Błąd");
        }
        else {
            toast.success("Usunięto");
            router.refresh();
        }
        setDeleting(null);
    };
    const categories = {
        wycieczki: "Wycieczki",
        uroczystosci: "Uroczystości",
        zajecia: "Zajęcia",
        konkursy: "Konkursy",
        inne: "Inne",
    };
    return (_jsx("div", { className: "space-y-4", children: galleries.length === 0 ? (_jsxs("div", { className: "text-center py-12 text-gray-500", children: [_jsx(ImageIcon, { className: "w-12 h-12 mx-auto mb-3 opacity-50" }), _jsx("p", { children: "Brak galerii. Utw\u00F3rz pierwsz\u0105 galeri\u0119." })] })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: galleries.map((gallery) => {
                const imageCount = gallery.image_count || 0;
                return (_jsxs("div", { className: "border rounded-lg overflow-hidden hover:shadow-lg transition-shadow", children: [_jsxs("div", { className: "aspect-video bg-gray-100 relative", children: [gallery.cover_image_url ? (_jsx("img", { src: gallery.cover_image_url || "/placeholder.svg", alt: gallery.title, className: "w-full h-full object-cover" })) : (_jsx("div", { className: "w-full h-full flex items-center justify-center", children: _jsx(ImageIcon, { className: "w-12 h-12 text-gray-400" }) })), _jsx("div", { className: "absolute top-2 right-2", children: _jsx("span", { className: `px-2 py-1 text-xs font-medium rounded ${gallery.status === "published" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`, children: gallery.status === "published" ? "Opublikowana" : "Szkic" }) })] }), _jsxs("div", { className: "p-4", children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-1", children: gallery.title }), _jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600 mb-3", children: [_jsx("span", { className: "bg-blue-100 text-blue-700 px-2 py-0.5 rounded", children: categories[gallery.category] || gallery.category }), _jsxs("span", { className: "text-xs", children: ["\u2022 ", imageCount, " zdj\u0119\u0107"] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Link, { href: `/admin/galleries/${gallery.id}/edit`, className: "flex-1", children: _jsxs(Button, { variant: "outline", size: "sm", className: "w-full bg-transparent", children: [_jsx(Edit, { className: "w-4 h-4 mr-1" }), "Edytuj"] }) }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => handleDelete(gallery.id), disabled: deleting === gallery.id, children: _jsx(Trash2, { className: "w-4 h-4 text-red-600" }) })] })] })] }, gallery.id));
            }) })) }));
}
