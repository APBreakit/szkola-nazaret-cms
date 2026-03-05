"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, Calendar, ImageIcon, Users, LogOut, UsersRound, Images, Utensils } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
const navigation = [
    { name: "Dashboard", href: "/admin", icon: Home },
    { name: "Posty", href: "/admin/posts", icon: FileText },
    { name: "Kalendarz", href: "/admin/calendar", icon: Calendar },
    { name: "Galerie", href: "/admin/galleries", icon: Images },
    { name: "Media", href: "/admin/media", icon: ImageIcon },
    { name: "Jadłospis", href: "/admin/meal-plan", icon: Utensils },
    { name: "Grupy", href: "/admin/groups", icon: Users },
    { name: "Rada Rodziców", href: "/admin/rada-rodzicow", icon: UsersRound },
    { name: "Użytkownicy", href: "/admin/users/new", icon: Users },
];
export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [role, setRole] = useState(null);
    useEffect(() => {
        const onToggle = () => setOpen((v) => !v);
        const onClose = () => setOpen(false);
        window.addEventListener('toggle-admin-sidebar', onToggle);
        window.addEventListener('close-admin-sidebar', onClose);
        fetch('/api/auth/session').then(r => r.json()).then((d) => setRole(d.user?.role || null)).catch(() => { });
        return () => {
            window.removeEventListener('toggle-admin-sidebar', onToggle);
            window.removeEventListener('close-admin-sidebar', onClose);
        };
    }, []);
    if (!pathname.startsWith('/admin'))
        return null;
    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
        }
        catch { }
        router.push('/admin/login');
        router.refresh();
    };
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "hidden lg:block fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200", children: _jsxs("div", { className: "flex flex-col h-full", children: [_jsxs("div", { className: "flex items-center gap-3 px-6 py-6 border-b border-gray-200", children: [_jsx(Image, { src: "/logo-szkoła.jpg", alt: "Logo Katolicka Szkoła Podstawowa Nazaret", width: 48, height: 48, className: "rounded-lg" }), _jsxs("div", { children: [_jsx("div", { className: "font-bold text-gray-900", children: "Katolicka Szkoła Podstawowa Nazaret" }), _jsx("div", { className: "text-xs text-gray-600", children: "Panel CMS" })] })] }), _jsx("nav", { className: "flex-1 px-4 py-6 space-y-1 overflow-y-auto", children: navigation.map((item) => {
                                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                                if (item.name === 'Użytkownicy' && role !== 'superadmin')
                                    return null;
                                return (_jsxs(Link, { href: item.href, prefetch: true, className: `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"}`, children: [_jsx(item.icon, { className: "w-5 h-5" }), item.name] }, item.name));
                            }) }), _jsx("div", { className: "p-4 border-t border-gray-200", children: _jsxs("button", { onClick: handleLogout, className: "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-700 hover:bg-red-50 w-full transition-all duration-150 hover:scale-105", children: [_jsx(LogOut, { className: "w-5 h-5" }), "Wyloguj si\u0119"] }) })] }) }), open && (_jsxs("div", { className: "lg:hidden fixed inset-0 z-50", children: [_jsx("div", { className: "absolute inset-0 bg-black/40", onClick: () => setOpen(false) }), _jsx("div", { className: "absolute inset-y-0 left-0 w-64 bg-white border-r border-gray-200 shadow-xl animate-slide-in-right", children: _jsxs("div", { className: "flex flex-col h-full", children: [_jsxs("div", { className: "flex items-center gap-3 px-6 py-6 border-b border-gray-200", children: [_jsx(Image, { src: "/logo-szkoła.jpg", alt: "Logo Katolicka Szkoła Podstawowa Nazaret", width: 40, height: 40, className: "rounded-lg" }), _jsx("div", { children: _jsx("div", { className: "font-semibold text-gray-900 text-sm", children: "Panel CMS" }) })] }), _jsx("nav", { className: "flex-1 px-4 py-6 space-y-1 overflow-y-auto", children: navigation.map((item) => {
                                        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                                        return (_jsxs(Link, { href: item.href, prefetch: true, className: `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"}`, onClick: () => setOpen(false), children: [_jsx(item.icon, { className: "w-5 h-5" }), item.name] }, item.name));
                                    }) }), _jsx("div", { className: "p-4 border-t border-gray-200", children: _jsxs("button", { onClick: handleLogout, className: "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-700 hover:bg-red-50 w-full", children: [_jsx(LogOut, { className: "w-5 h-5" }), "Wyloguj si\u0119"] }) })] }) })] }))] }));
}
