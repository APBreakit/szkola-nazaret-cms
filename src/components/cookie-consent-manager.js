"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from 'next/navigation';
const STORAGE_KEY = "cookieConsent.v2";
const POLICY_VERSION = "2025-09-03";
function readConsent() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw)
            return null;
        const parsed = JSON.parse(raw);
        if (parsed.policyVersion !== POLICY_VERSION)
            return null; // wymusza ponowną zgodę
        return parsed;
    }
    catch {
        return null;
    }
}
function writeConsent(record) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    // Opcjonalne wysłanie logu do backendu
    fetch("/api/consent-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
    }).catch(() => { });
}
function dispatchConsentChanged(record) {
    window.dispatchEvent(new CustomEvent("cookie-consent-changed", { detail: record }));
}
export default function CookieConsentManager({ brandName = "Your Brand", policyLinks = { privacy: "/privacy", cookies: "/cookies" }, translations = {
    pl: {
        title: "Twoja prywatność jest dla nas ważna",
        description: "Używamy plików cookies do zapewnienia działania strony, analizy i personalizacji.",
        acceptAll: "Akceptuj wszystkie",
        rejectAll: "Odrzuć wszystkie",
        customize: "Dostosuj ustawienia",
        save: "Zapisz ustawienia",
        categories: {
            necessary: "Niezbędne",
            functional: "Funkcjonalne",
            analytics: "Analityczne",
            marketing: "Marketingowe",
            personalization: "Personalizacja treści",
        },
    },
    en: {
        title: "Your privacy matters to us",
        description: "We use cookies to ensure site functionality, analytics and personalization.",
        acceptAll: "Accept all",
        rejectAll: "Reject all",
        customize: "Customize",
        save: "Save settings",
        categories: {
            necessary: "Necessary",
            functional: "Functional",
            analytics: "Analytics",
            marketing: "Marketing",
            personalization: "Personalization",
        },
    },
}, forceLang, className = "", }) {
    const pathname = usePathname();
    if (pathname?.startsWith("/admin")) {
        return null;
    }
    const [lang, setLang] = useState(forceLang || "pl");
    const t = translations[lang];
    const [record, setRecord] = useState(null);
    const [open, setOpen] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [categories, setCategories] = useState(() => record?.categories ?? {
        necessary: true,
        functional: false,
        analytics: false,
        marketing: false,
        personalization: false,
    });
    const modalTitleId = useId();
    const firstFocusableRef = useRef(null);
    useEffect(() => {
        if (open)
            firstFocusableRef.current?.focus();
    }, [open, showDetail]);
    useEffect(() => {
        if (!forceLang) {
            const nl = typeof navigator !== "undefined" && navigator.language ? navigator.language : "pl";
            setLang(nl.startsWith("pl") ? "pl" : "en");
        }
    }, [forceLang]);
    useEffect(() => {
        const r = readConsent();
        setRecord(r);
        setOpen(!(r?.decided));
    }, []);
    const commit = (next) => {
        const nextRecord = {
            categories: { ...next, necessary: true },
            decided: true,
            timestamp: Date.now(),
            version: 2,
            policyVersion: POLICY_VERSION,
        };
        writeConsent(nextRecord);
        setRecord(nextRecord);
        dispatchConsentChanged(nextRecord);
        setOpen(false);
    };
    const acceptAll = () => commit({
        necessary: true,
        functional: true,
        analytics: true,
        marketing: true,
        personalization: true,
    });
    const rejectAll = () => commit({
        necessary: true,
        functional: false,
        analytics: false,
        marketing: false,
        personalization: false,
    });
    const saveCustom = () => commit(categories);
    const resetAndOpen = () => {
        setCategories(record?.categories ?? {
            necessary: true,
            functional: false,
            analytics: false,
            marketing: false,
            personalization: false,
        });
        setShowDetail(true);
        setOpen(true);
    };
    const showFab = record?.decided ?? false;
    return (_jsxs(_Fragment, { children: [_jsx(AnimatePresence, { initial: false, children: showFab && (_jsx(motion.button, { onClick: resetAndOpen, "aria-label": "Open cookie settings", className: "fixed bottom-24 right-6 z-[50] rounded-full bg-white p-2 shadow-lg ring-2 ring-blue-200 hover:ring-blue-300 transition-all dark:bg-zinc-800 dark:ring-blue-800", initial: { y: 40, opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: 40, opacity: 0 }, children: _jsx(motion.div, { className: "flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-500 shadow-md text-xl", animate: { rotate: [0, -10, 10, 0] }, transition: { repeat: Number.POSITIVE_INFINITY, repeatDelay: 10, duration: 1.2 }, children: "\uD83C\uDF6A" }) }, "cookie-fab")) }), _jsx(AnimatePresence, { initial: false, children: open && (_jsx(motion.div, { className: "fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm", children: _jsx("div", { className: "absolute inset-0 grid place-items-center p-4", children: _jsxs(motion.div, { "aria-labelledby": modalTitleId, role: "dialog", "aria-modal": "true", className: `mx-auto w-[min(480px,90vw)] rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-blue-100 dark:bg-zinc-900 dark:ring-blue-900 ${className}`, initial: { y: 24, opacity: 0, scale: 0.95 }, animate: { y: 0, opacity: 1, scale: 1 }, exit: { y: 16, opacity: 0, scale: 0.95 }, children: [_jsxs("div", { className: "mb-4 flex items-center gap-3", children: [_jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-blue-500 text-xl shadow-md", children: "\uD83C\uDF6A" }), _jsx("h2", { id: modalTitleId, className: "text-lg font-bold text-zinc-900 dark:text-white", children: t.title })] }), _jsx("p", { className: "text-sm leading-relaxed text-zinc-600 dark:text-zinc-300", children: t.description }), !showDetail ? (_jsxs("div", { className: "mt-5 space-y-2.5", children: [_jsxs("div", { className: "flex flex-col gap-2.5 sm:flex-row", children: [_jsx("button", { ref: firstFocusableRef, onClick: acceptAll, className: "flex-1 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-5 py-2.5 font-semibold text-white shadow-lg hover:shadow-xl transition-all hover:scale-105", children: t.acceptAll }), _jsx("button", { onClick: rejectAll, className: "flex-1 rounded-xl border-2 border-zinc-300 bg-white px-5 py-2.5 font-medium text-zinc-700 hover:bg-zinc-50 transition-all dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-600", children: t.rejectAll })] }), _jsx("button", { onClick: () => setShowDetail(true), className: "w-full rounded-xl border-2 border-blue-300 bg-blue-50 px-5 py-2.5 font-medium text-blue-900 hover:bg-blue-100 transition-all dark:bg-blue-950 dark:text-blue-200 dark:border-blue-800", children: t.customize })] })) : (_jsxs("div", { className: "mt-5 space-y-3", children: [_jsx("div", { className: "space-y-2.5 rounded-xl bg-blue-50/50 p-3 dark:bg-zinc-800/50", children: Object.entries(t.categories).map(([key, label]) => (_jsxs("label", { className: "flex items-center justify-between gap-4 cursor-pointer group", children: [_jsx("span", { className: "text-sm font-medium text-zinc-700 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors", children: label }), _jsx("input", { type: "checkbox", disabled: key === "necessary", checked: categories[key], onChange: (e) => setCategories((s) => ({
                                                            ...s,
                                                            [key]: e.target.checked,
                                                        })), className: "h-4 w-4 rounded border-2 border-blue-300 text-blue-500 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed" })] }, key))) }), _jsxs("div", { className: "flex flex-col gap-2.5 sm:flex-row", children: [_jsx("button", { onClick: rejectAll, className: "flex-1 rounded-xl border-2 border-zinc-300 bg-white px-5 py-2.5 font-medium text-zinc-700 hover:bg-zinc-50 transition-all dark:bg-zinc-800 dark:text-zinc-200", children: t.rejectAll }), _jsx("button", { onClick: saveCustom, className: "flex-1 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-5 py-2.5 font-semibold text-white shadow-lg hover:shadow-xl transition-all hover:scale-105", children: t.save })] })] })), _jsxs("p", { className: "mt-5 text-center text-xs text-zinc-500 dark:text-zinc-400", children: [_jsx("a", { href: policyLinks.privacy, className: "underline hover:text-blue-600 transition-colors", children: "Polityka Prywatno\u015Bci" }), " · ", _jsx("a", { href: policyLinks.cookies, className: "underline hover:text-blue-600 transition-colors", children: "Polityka Cookies" })] })] }) }) })) })] }));
}
