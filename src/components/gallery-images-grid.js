"use client";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import Image from "next/image";
import { GalleryLightbox } from "@/components/gallery-lightbox";
export default function GalleryImagesGrid({ images }) {
    const [lightboxIndex, setLightboxIndex] = useState(null);
    const mapped = images.map((img) => ({ id: img.id, file_url: img.image_url, file_name: img.title || "" }));
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4", children: images.map((img, i) => (_jsx("button", { className: "relative w-full aspect-square overflow-hidden rounded-xl border", onClick: () => setLightboxIndex(i), children: _jsx(Image, { src: img.image_url, alt: img.title || "", fill: true, className: "object-cover" }) }, img.id))) }), lightboxIndex !== null && (_jsx(GalleryLightbox, { images: mapped, currentIndex: lightboxIndex, onClose: () => setLightboxIndex(null) }))] }));
}
