"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
export default function AdminHeader({ user }) {
    if (!user) {
        console.error("[v0] AdminHeader rendered without user prop");
        return null;
    }
    const [open, setOpen] = useState(false);
    return (_jsx("header", { className: "sticky top-0 z-30 bg-white border-b border-gray-200", children: _jsxs("div", { className: "flex items-center justify-between px-6 py-4 relative", children: [_jsx("button", { className: "lg:hidden p-2 rounded-lg hover:bg-gray-100", onClick: () => {
                        try {
                            window.dispatchEvent(new Event('toggle-admin-sidebar'));
                        }
                        catch { }
                    }, children: _jsx(Menu, { className: "w-6 h-6" }) }), _jsx("div", { className: "flex-1" }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "flex items-center gap-3 pl-4 border-l border-gray-200", children: [_jsxs("div", { className: "text-right", children: [_jsx("div", { className: "text-sm font-medium text-gray-900", children: user.email }), _jsx("div", { className: "text-xs text-gray-600", children: "Administrator" })] }), _jsx("button", { className: "w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center", onClick: () => setOpen(!open), children: _jsx("span", { className: "text-white font-medium text-sm", children: user.email[0]?.toUpperCase() || "?" }) })] }), open && (_jsx("div", { className: "absolute right-6 top-16 bg-white border rounded shadow-md w-48", children: _jsx(Link, { href: "/admin/account", className: "block px-3 py-2 hover:bg-gray-50 text-sm", children: "Zmie\u0144 has\u0142o" }) }))] })] }) }));
}
