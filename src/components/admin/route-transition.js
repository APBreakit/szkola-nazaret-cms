"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
export default function RouteTransition({ children }) {
    const pathname = usePathname();
    return (_jsx(AnimatePresence, { mode: "popLayout", initial: false, children: _jsx(motion.div, { initial: { opacity: 0, y: 4 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -4 }, transition: { duration: 0.1, ease: "easeOut" }, children: children }, pathname) }));
}
