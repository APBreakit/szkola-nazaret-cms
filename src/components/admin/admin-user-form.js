"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createAdminUser } from "@/app/actions/admin-actions";
import { toast } from "sonner";
const SECTIONS = [
    { key: "all", label: "Wszystkie sekcje" },
    { key: "posts", label: "Posty" },
    { key: "galleries", label: "Galerie" },
    { key: "media", label: "Media" },
    { key: "groups", label: "Grupy" },
    { key: "meal_plans", label: "Jadłospis" },
    { key: "rada_rodzicow", label: "Rada Rodziców" },
];
export default function AdminUserForm() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [perms, setPerms] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const togglePerm = (key) => {
        setPerms((prev) => {
            if (prev.includes(key))
                return prev.filter((k) => k !== key);
            return key === "all" ? ["all"] : [...prev.filter((k) => k !== "all"), key];
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (!email || !password || !confirm) {
            setError("Wypełnij wymagane pola");
            return;
        }
        if (password !== confirm) {
            setError("Hasła nie są zgodne");
            return;
        }
        setLoading(true);
        const result = await createAdminUser({ email, password, name: name || null, permissions: perms });
        setLoading(false);
        if (!result.success) {
            setError(result.error || "Nie udało się utworzyć użytkownika");
            return;
        }
        toast.success("Zapisano");
        router.push("/admin");
        router.refresh();
    };
    return (_jsx("form", { onSubmit: handleSubmit, children: _jsx(Card, { children: _jsxs(CardContent, { className: "p-6 space-y-6", children: [error && _jsx("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm", children: error }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "email", children: "Email *" }), _jsx(Input, { id: "email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "name", children: "Imi\u0119 (opcjonalnie)" }), _jsx(Input, { id: "name", value: name, onChange: (e) => setName(e.target.value) })] })] }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "password", children: "Has\u0142o *" }), _jsx(Input, { id: "password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "confirm", children: "Potwierd\u017A has\u0142o *" }), _jsx(Input, { id: "confirm", type: "password", value: confirm, onChange: (e) => setConfirm(e.target.value), required: true })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Uprawnienia sekcji" }), _jsx("div", { className: "grid md:grid-cols-3 gap-3 mt-2", children: SECTIONS.map((s) => (_jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: perms.includes(s.key), onChange: () => togglePerm(s.key) }), _jsx("span", { className: "text-sm", children: s.label })] }, s.key))) })] }), _jsx("div", { className: "flex gap-4", children: _jsx(Button, { type: "submit", disabled: loading, children: loading ? "Tworzenie..." : "Utwórz administratora" }) })] }) }) }));
}
