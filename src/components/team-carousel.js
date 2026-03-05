"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import Image from "next/image";
const teamSlides = [
    {
        id: 1,
        title: "Grono Pedagogiczne",
        description: "Nauczyciele, którzy codziennie wspierają rozwój naszych uczniów",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-61BLB7kQUC4R8ksjLbVe8PH3ndxs95.jpg",
        alt: "Grono pedagogiczne szkoły Nazaret",
    },
    {
        id: 2,
        title: "Zespół Wspierający",
        description: "Personel odpowiedzialny za wyżywienie, czystość i bezpieczeństwo szkoły",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2-9BEq7uPSqJL2aD2H9qszlfdPb2CRHw.jpg",
        alt: "Zespół wspierający szkoły Nazaret",
    },
];
export function TeamCarousel() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    useEffect(() => {
        if (!isAutoPlaying)
            return;
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % teamSlides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [isAutoPlaying]);
    const goToSlide = (index) => {
        setCurrentSlide(index);
        setIsAutoPlaying(false);
    };
    return (_jsxs("div", { className: "relative rounded-3xl overflow-hidden group h-full min-h-[600px]", children: [_jsx("div", { className: "relative h-full", children: teamSlides.map((slide, index) => (_jsxs("div", { className: `absolute inset-0 transition-opacity duration-700 ${index === currentSlide ? "opacity-100" : "opacity-0"}`, children: [_jsx(Image, { src: slide.image || "/placeholder.svg", alt: slide.alt, fill: true, priority: index === 0, loading: index === 0 ? undefined : "lazy", sizes: "(max-width: 768px) 100vw, 50vw", className: "object-cover transition-transform duration-700 group-hover:scale-110" }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" }), _jsxs("div", { className: "absolute bottom-0 left-0 right-0 bg-card p-6 lg:p-8", children: [_jsx("h4", { className: "text-2xl lg:text-3xl text-primary mb-2 font-semibold", children: slide.title }), _jsx("p", { className: "text-sm lg:text-base text-muted-foreground", children: slide.description })] })] }, slide.id))) }), _jsx("div", { className: "absolute bottom-36 lg:bottom-44 left-1/2 -translate-x-1/2 flex gap-2.5 z-10", children: teamSlides.map((_, index) => (_jsx("button", { onClick: () => goToSlide(index), className: `rounded-full transition-all duration-500 ease-out ${index === currentSlide
                        ? "bg-card shadow-lg w-8 h-2.5"
                        : "bg-card/60 hover:bg-card/80 w-2.5 h-2.5 hover:scale-110"}`, "aria-label": `Go to slide ${index + 1}` }, index))) })] }));
}
