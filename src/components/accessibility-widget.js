"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Accessibility, Type, Contrast, Eye, LinkIcon, Palette } from 'lucide-react';
export default function AccessibilityWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [fontSize, setFontSize] = useState(100);
    const [highContrast, setHighContrast] = useState(false);
    const [highlightLinks, setHighlightLinks] = useState(false);
    const [readableFont, setReadableFont] = useState(false);
    const [grayscale, setGrayscale] = useState(false);
    // Load saved preferences from localStorage
    useEffect(() => {
        const savedFontSize = localStorage.getItem("a11y-font-size");
        const savedHighContrast = localStorage.getItem("a11y-high-contrast");
        const savedHighlightLinks = localStorage.getItem("a11y-highlight-links");
        const savedReadableFont = localStorage.getItem("a11y-readable-font");
        const savedGrayscale = localStorage.getItem("a11y-grayscale");
        if (savedFontSize)
            setFontSize(Number.parseInt(savedFontSize));
        if (savedHighContrast)
            setHighContrast(savedHighContrast === "true");
        if (savedHighlightLinks)
            setHighlightLinks(savedHighlightLinks === "true");
        if (savedReadableFont)
            setReadableFont(savedReadableFont === "true");
        if (savedGrayscale)
            setGrayscale(savedGrayscale === "true");
    }, []);
    // Apply font size
    useEffect(() => {
        document.documentElement.style.fontSize = `${fontSize}%`;
        localStorage.setItem("a11y-font-size", fontSize.toString());
    }, [fontSize]);
    // Apply high contrast
    useEffect(() => {
        if (highContrast) {
            document.documentElement.classList.add("high-contrast");
        }
        else {
            document.documentElement.classList.remove("high-contrast");
        }
        localStorage.setItem("a11y-high-contrast", highContrast.toString());
    }, [highContrast]);
    // Apply link highlighting
    useEffect(() => {
        if (highlightLinks) {
            document.documentElement.classList.add("highlight-links");
        }
        else {
            document.documentElement.classList.remove("highlight-links");
        }
        localStorage.setItem("a11y-highlight-links", highlightLinks.toString());
    }, [highlightLinks]);
    // Apply readable font
    useEffect(() => {
        if (readableFont) {
            document.documentElement.classList.add("readable-font");
        }
        else {
            document.documentElement.classList.remove("readable-font");
        }
        localStorage.setItem("a11y-readable-font", readableFont.toString());
    }, [readableFont]);
    // Apply grayscale
    useEffect(() => {
        if (grayscale) {
            document.documentElement.classList.add("grayscale-mode");
        }
        else {
            document.documentElement.classList.remove("grayscale-mode");
        }
        localStorage.setItem("a11y-grayscale", grayscale.toString());
    }, [grayscale]);
    const resetSettings = () => {
        setFontSize(100);
        setHighContrast(false);
        setHighlightLinks(false);
        setReadableFont(false);
        setGrayscale(false);
        localStorage.removeItem("a11y-font-size");
        localStorage.removeItem("a11y-high-contrast");
        localStorage.removeItem("a11y-highlight-links");
        localStorage.removeItem("a11y-readable-font");
        localStorage.removeItem("a11y-grayscale");
    };
    return (_jsxs(_Fragment, { children: [_jsx(Button, { onClick: () => setIsOpen(!isOpen), size: "lg", className: "fixed bottom-24 left-6 z-50 h-14 w-14 rounded-full bg-background border-2 border-primary text-primary shadow-lg hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all duration-300", "aria-label": "Otw\u00F3rz ustawienia dost\u0119pno\u015Bci", children: _jsx(Accessibility, { className: "h-6 w-6" }) }), isOpen && (_jsxs(Card, { className: "fixed bottom-42 left-6 z-50 w-[90vw] max-w-md shadow-2xl animate-scale-in border-2", children: [_jsxs(CardHeader, { className: "relative pb-4 bg-muted/50", children: [_jsx(Button, { variant: "ghost", size: "icon", onClick: () => setIsOpen(false), className: "absolute right-2 top-2", "aria-label": "Zamknij", children: _jsx(X, { className: "h-4 w-4" }) }), _jsxs(CardTitle, { className: "flex items-center gap-2 text-xl", children: [_jsx(Accessibility, { className: "h-5 w-5" }), "Dost\u0119pno\u015B\u0107"] }), _jsx(CardDescription, { children: "Dostosuj stron\u0119 do swoich potrzeb" })] }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("label", { htmlFor: "font-size", className: "flex items-center gap-2 text-sm font-medium", children: [_jsx(Type, { className: "h-4 w-4" }), "Rozmiar tekstu"] }), _jsxs("span", { className: "text-sm text-muted-foreground", children: [fontSize, "%"] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Button, { variant: "outline", size: "sm", onClick: () => setFontSize(Math.max(80, fontSize - 10)), disabled: fontSize <= 80, "aria-label": "Zmniejsz rozmiar tekstu", children: "A-" }), _jsx("input", { id: "font-size", type: "range", min: "80", max: "150", step: "10", value: fontSize, onChange: (e) => setFontSize(Number.parseInt(e.target.value)), className: "flex-1", "aria-label": "Suwak rozmiaru tekstu" }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => setFontSize(Math.min(150, fontSize + 10)), disabled: fontSize >= 150, "aria-label": "Zwi\u0119ksz rozmiar tekstu", children: "A+" })] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("label", { htmlFor: "high-contrast", className: "flex items-center gap-2 text-sm font-medium", children: [_jsx(Contrast, { className: "h-4 w-4" }), "Wysoki kontrast"] }), _jsx(Button, { id: "high-contrast", variant: highContrast ? "default" : "outline", size: "sm", onClick: () => setHighContrast(!highContrast), "aria-pressed": highContrast, children: highContrast ? "Włączone" : "Wyłączone" })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("label", { htmlFor: "highlight-links", className: "flex items-center gap-2 text-sm font-medium", children: [_jsx(LinkIcon, { className: "h-4 w-4" }), "Pod\u015Bwietl linki"] }), _jsx(Button, { id: "highlight-links", variant: highlightLinks ? "default" : "outline", size: "sm", onClick: () => setHighlightLinks(!highlightLinks), "aria-pressed": highlightLinks, children: highlightLinks ? "Włączone" : "Wyłączone" })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("label", { htmlFor: "readable-font", className: "flex items-center gap-2 text-sm font-medium", children: [_jsx(Eye, { className: "h-4 w-4" }), "Czytelna czcionka"] }), _jsx(Button, { id: "readable-font", variant: readableFont ? "default" : "outline", size: "sm", onClick: () => setReadableFont(!readableFont), "aria-pressed": readableFont, children: readableFont ? "Włączone" : "Wyłączone" })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("label", { htmlFor: "grayscale", className: "flex items-center gap-2 text-sm font-medium", children: [_jsx(Palette, { className: "h-4 w-4" }), "Odcienie szaro\u015Bci"] }), _jsx(Button, { id: "grayscale", variant: grayscale ? "default" : "outline", size: "sm", onClick: () => setGrayscale(!grayscale), "aria-pressed": grayscale, children: grayscale ? "Włączone" : "Wyłączone" })] }), _jsx(Button, { variant: "secondary", className: "w-full", onClick: resetSettings, children: "Przywr\u00F3\u0107 domy\u015Blne" })] })] }))] }));
}
