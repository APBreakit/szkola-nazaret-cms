"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Calendar, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
export default function GroupPostsSection({ groupSlug }) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function fetchGroupPosts() {
            try {
                const response = await fetch(`/api/posts?group=${groupSlug}&status=published&limit=6`);
                if (!response.ok) {
                    throw new Error("Failed to fetch posts");
                }
                const data = await response.json();
                setPosts(data || []);
            }
            catch (error) {
                console.error("[v0] Error fetching group posts:", error);
                setPosts([]);
            }
            finally {
                setLoading(false);
            }
        }
        fetchGroupPosts();
    }, [groupSlug]);
    if (loading) {
        return (_jsxs("div", { className: "bg-white rounded-2xl p-6 shadow-sm border border-[#e5dfd8] mb-12", children: [_jsx("h2", { className: "text-2xl font-bold text-[#443b32] mb-4", children: "Aktualno\u015Bci dla Grupy" }), _jsx("p", { className: "text-[#6b5f52]", children: "\u0141adowanie aktualno\u015Bci..." })] }));
    }
    if (posts.length === 0) {
        return null;
    }
    return (_jsxs("div", { className: "bg-white rounded-2xl p-6 shadow-sm border border-[#e5dfd8] mb-12", children: [_jsx("h2", { className: "text-2xl font-bold text-[#443b32] mb-6", children: "Aktualno\u015Bci dla Grupy" }), _jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6", children: posts.map((post) => (_jsxs(Link, { href: `/${post.type || 'aktualnosci'}/${post.slug}`, className: "group rounded-xl overflow-hidden border border-[#e5dfd8] hover:border-[#443b32] transition-all hover:shadow-lg", children: [post.image_url && (_jsx("div", { className: "relative h-48 overflow-hidden", children: _jsx(Image, { src: post.image_url || "/placeholder.svg", alt: post.title, fill: true, className: "object-cover group-hover:scale-105 transition-transform duration-300" }) })), _jsxs("div", { className: "p-4", children: [_jsx("h3", { className: "font-semibold text-[#443b32] mb-2 group-hover:text-[#6fc0e8] transition-colors line-clamp-2", children: post.title }), _jsx("p", { className: "text-sm text-[#6b5f52] mb-3 line-clamp-2", children: post.excerpt }), _jsxs("div", { className: "flex items-center justify-between text-xs text-[#6b5f52]", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Calendar, { className: "w-3 h-3" }), new Date(post.created_at).toLocaleDateString("pl-PL")] }), _jsxs("span", { className: "flex items-center gap-1 text-[#2f67ab] group-hover:text-[#6fc0e8]", children: [_jsx(Eye, { className: "w-3 h-3" }), "Czytaj wi\u0119cej"] })] })] })] }, post.id))) })] }));
}
