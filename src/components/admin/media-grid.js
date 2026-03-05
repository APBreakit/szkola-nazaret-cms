"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteMedia } from "@/app/actions/admin-actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Copy, FileText, Trash2, Check } from "lucide-react";
export default function MediaGrid({ media }) {
    const router = useRouter();
    const [deletingId, setDeletingId] = useState(null);
    const [copiedId, setCopiedId] = useState(null);
    const handleDelete = async (id) => {
        if (!confirm("Czy na pewno chcesz usunąć ten plik?"))
            return;
        setDeletingId(id);
        const result = await deleteMedia(id);
        if (!result.success) {
            toast.error("Błąd");
            console.error(result.error);
        }
        else {
            toast.success("Usunięto");
            router.refresh();
        }
        setDeletingId(null);
    };
    const handleCopyUrl = async (url, id) => {
        try {
            await navigator.clipboard.writeText(url);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        }
        catch (err) {
            console.error("Failed to copy:", err);
        }
    };
    if (media.length === 0) {
        return (_jsx("div", { className: "text-center py-12", children: _jsx("p", { className: "text-gray-600", children: "Brak plik\u00F3w do wy\u015Bwietlenia" }) }));
    }
    return (_jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4", children: media.map((item) => (_jsxs("div", { className: "group relative bg-white border border-gray-200 rounded-lg overflow-hidden", children: [item.file_type === "image" ? (_jsx("div", { className: "aspect-square bg-gray-100", children: _jsx("img", { src: item.file_url || "/placeholder.svg", alt: item.alt_text || item.filename, className: "w-full h-full object-cover" }) })) : (_jsx("div", { className: "aspect-square bg-gray-100 flex items-center justify-center", children: _jsx(FileText, { className: "w-16 h-16 text-gray-400" }) })), _jsxs("div", { className: "p-3", children: [_jsx("p", { className: "text-sm font-medium text-gray-900 truncate", title: item.filename, children: item.filename }), _jsxs("div", { className: "flex items-center gap-2 mt-1", children: [_jsx("span", { className: "text-xs text-gray-600", children: item.file_type }), _jsx("span", { className: "text-gray-300", children: "\u2022" }), _jsx("span", { className: "text-xs text-gray-600", children: item.category })] })] }), _jsxs("div", { className: "absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1", children: [_jsx(Button, { variant: "secondary", size: "sm", onClick: () => handleCopyUrl(item.file_url, item.id), className: "h-8 w-8 p-0", children: copiedId === item.id ? _jsx(Check, { className: "w-4 h-4" }) : _jsx(Copy, { className: "w-4 h-4" }) }), _jsx(Button, { variant: "secondary", size: "sm", onClick: () => handleDelete(item.id), disabled: deletingId === item.id, className: "h-8 w-8 p-0", children: _jsx(Trash2, { className: "w-4 h-4 text-red-600" }) })] })] }, item.id))) }));
}
