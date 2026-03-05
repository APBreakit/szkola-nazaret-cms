"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
export function GalleryLightbox({ images, currentIndex, onClose }) {
    const [index, setIndex] = useState(currentIndex);
    const goToPrevious = () => {
        setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };
    const goToNext = () => {
        setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };
    const handleKeyDown = (e) => {
        if (e.key === "Escape")
            onClose();
        if (e.key === "ArrowLeft")
            goToPrevious();
        if (e.key === "ArrowRight")
            goToNext();
    };
    return (_jsxs("div", { className: "fixed inset-0 z-50 bg-black/90 flex items-center justify-center", onClick: onClose, onKeyDown: handleKeyDown, role: "dialog", "aria-modal": "true", children: [_jsx(Button, { variant: "ghost", size: "icon", className: "absolute top-4 right-4 text-white hover:bg-white/10", onClick: onClose, children: _jsx(X, { className: "w-6 h-6" }) }), _jsx(Button, { variant: "ghost", size: "icon", className: "absolute left-4 text-white hover:bg-white/10", onClick: (e) => {
                    e.stopPropagation();
                    goToPrevious();
                }, children: _jsx(ChevronLeft, { className: "w-8 h-8" }) }), _jsxs("div", { className: "max-w-7xl max-h-[90vh] px-16", onClick: (e) => e.stopPropagation(), children: [_jsx("img", { src: images[index].file_url || "/placeholder.svg", alt: images[index].file_name, className: "max-w-full max-h-[90vh] object-contain rounded-lg" }), _jsxs("p", { className: "text-white text-center mt-4", children: [index + 1, " / ", images.length] })] }), _jsx(Button, { variant: "ghost", size: "icon", className: "absolute right-4 text-white hover:bg-white/10", onClick: (e) => {
                    e.stopPropagation();
                    goToNext();
                }, children: _jsx(ChevronRight, { className: "w-8 h-8" }) })] }));
}
