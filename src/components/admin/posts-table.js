"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Pencil, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { deletePost } from "@/app/actions/admin-actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
export default function PostsTable({ posts }) {
    const router = useRouter();
    const [deletingId, setDeletingId] = useState(null);
    const handleDelete = async (id) => {
        if (!confirm("Czy na pewno chcesz usunąć ten post?"))
            return;
        setDeletingId(id);
        const result = await deletePost(id);
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
    const getTypeLabel = (type) => {
        switch (type) {
            case "aktualnosci":
                return "Aktualność";
            case "ogloszenia":
                return "Ogłoszenie";
            case "konkursy":
                return "Konkurs";
            case "rada-rodzicow":
                return "Rada Rodziców";
            default:
                return type;
        }
    };
    const getStatusBadge = (status) => {
        switch (status) {
            case "published":
                return (_jsx("span", { className: "px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full", children: "Opublikowany" }));
            case "draft":
                return _jsx("span", { className: "px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full", children: "Szkic" });
            case "archived":
                return (_jsx("span", { className: "px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full", children: "Zarchiwizowany" }));
            default:
                return status;
        }
    };
    if (posts.length === 0) {
        return (_jsx("div", { className: "text-center py-12", children: _jsx("p", { className: "text-gray-600", children: "Brak post\u00F3w do wy\u015Bwietlenia" }) }));
    }
    return (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-gray-200", children: [_jsx("th", { className: "text-left py-3 px-4 text-sm font-medium text-gray-700", children: "Tytu\u0142" }), _jsx("th", { className: "text-left py-3 px-4 text-sm font-medium text-gray-700", children: "Typ" }), _jsx("th", { className: "text-left py-3 px-4 text-sm font-medium text-gray-700", children: "Status" }), _jsx("th", { className: "text-left py-3 px-4 text-sm font-medium text-gray-700", children: "Data utworzenia" }), _jsx("th", { className: "text-right py-3 px-4 text-sm font-medium text-gray-700", children: "Akcje" })] }) }), _jsx("tbody", { children: posts.map((post) => (_jsxs("tr", { className: "border-b border-gray-100 hover:bg-gray-50", children: [_jsx("td", { className: "py-3 px-4", children: _jsx("div", { className: "font-medium text-gray-900", children: post.title }) }), _jsx("td", { className: "py-3 px-4", children: _jsx("span", { className: "text-sm text-gray-600", children: getTypeLabel(post.type) }) }), _jsx("td", { className: "py-3 px-4", children: getStatusBadge(post.status) }), _jsx("td", { className: "py-3 px-4", children: _jsx("span", { className: "text-sm text-gray-600", children: new Date(post.created_at).toLocaleDateString("pl-PL") }) }), _jsx("td", { className: "py-3 px-4", children: _jsxs("div", { className: "flex items-center justify-end gap-2", children: [_jsx(Button, { variant: "ghost", size: "sm", asChild: true, children: _jsx(Link, { href: `/admin/posts/${post.id}`, children: _jsx(Eye, { className: "w-4 h-4" }) }) }), _jsx(Button, { variant: "ghost", size: "sm", asChild: true, children: _jsx(Link, { href: `/admin/posts/${post.id}/edit`, children: _jsx(Pencil, { className: "w-4 h-4" }) }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleDelete(post.id), disabled: deletingId === post.id, children: _jsx(Trash2, { className: "w-4 h-4 text-red-600" }) })] }) })] }, post.id))) })] }) }));
}
