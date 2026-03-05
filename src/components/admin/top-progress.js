"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
export default function TopProgress() {
    const pathname = usePathname();
    const [progress, setProgress] = useState(0);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        setVisible(true);
        setProgress(1);
        const tHide = setTimeout(() => setVisible(false), 150);
        return () => {
            clearTimeout(tHide);
        };
    }, [pathname]);
    return (_jsx("div", { className: "fixed left-0 right-0 top-0 z-[70] h-0.5", children: _jsx(AnimatePresence, { initial: false, children: visible && (_jsx(motion.div, { initial: { width: 0 }, animate: { width: `${progress * 100}%` }, exit: { opacity: 0 }, transition: { ease: "easeOut", duration: 0.1 }, className: "h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" }, pathname + ":bar")) }) }));
}
