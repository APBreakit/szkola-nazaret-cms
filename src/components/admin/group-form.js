"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateGroup } from "@/app/actions/admin-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, ArrowLeft, Upload, X, FileText, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { optimizeImage } from "@/lib/utils/image-optimizer";
import { toast } from "sonner";
export default function GroupForm({ group }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    // Parse documents from JSON if exists
    const initialDocuments = Array.isArray(group.documents) ? group.documents : [];
    const [documents, setDocuments] = useState(initialDocuments);
    const [newDocTitle, setNewDocTitle] = useState("");
    const [uploadingDoc, setUploadingDoc] = useState(false);
    const [formData, setFormData] = useState({
        password: group.password || "",
        teacher_name: group.teacher_name || "",
        teacher_email: group.teacher_email || "",
        teacher_phone: group.teacher_phone || "",
        teacher_photo: group.teacher_photo || "",
        // meal_plan_url is managed centrally; removed from group settings
        age_group: group.age_group || "",
        hours: group.hours || "",
        number_of_children: group.number_of_children?.toString() || "",
        description: group.description || "",
        contact_hours: group.contact_hours || "",
        color: group.color || "#E5E7EB",
    });
    const initialTeachers = Array.isArray(group.teachers) ? group.teachers : [];
    const [teachers, setTeachers] = useState(initialTeachers.length > 0 ? initialTeachers.slice(0, 2) : [{ name: "", email: "", phone: "" }]);
    const handleFileUpload = async (file, type) => {
        try {
            if (type === "photo" && !file.type.startsWith("image/")) {
                throw new Error("Proszę wybrać plik graficzny");
            }
            const allowedDocs = [
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "application/vnd.ms-excel",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "text/plain",
            ];
            if (type === "document" && !allowedDocs.includes(file.type)) {
                throw new Error("Nieobsługiwany typ pliku");
            }
            if (type !== "photo" && file.size > 10 * 1024 * 1024) {
                throw new Error("Plik jest zbyt duży (max 10MB)");
            }
            let fileToUpload = file;
            if (type === "photo") {
                setUploadingPhoto(true);
                fileToUpload = await optimizeImage(file, 800, 0.85);
            }
            else {
                setUploadingDoc(true);
            }
            const formData = new FormData();
            formData.append("file", fileToUpload);
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            if (!response.ok)
                throw new Error("Upload failed");
            const data = await response.json();
            if (type === "photo") {
                setFormData((prev) => ({ ...prev, teacher_photo: data.url }));
            }
            else {
                return data.url;
            }
        }
        catch (err) {
            console.error("Upload error:", err);
            setError(err instanceof Error ? err.message : "Błąd przesyłania pliku");
        }
        finally {
            setUploadingPhoto(false);
            setUploadingDoc(false);
        }
    };
    const handleAddDocument = async (e) => {
        const file = e.target.files?.[0];
        if (!file || !newDocTitle.trim()) {
            if (!newDocTitle.trim())
                alert("Wprowadź nazwę dokumentu");
            return;
        }
        const url = await handleFileUpload(file, "document");
        if (url) {
            setDocuments((prev) => [...prev, { title: newDocTitle, url }]);
            setNewDocTitle("");
        }
    };
    const removeDocument = (index) => {
        setDocuments((prev) => prev.filter((_, i) => i !== index));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        console.log("[v0] Submitting group form:", formData);
        try {
            const result = await updateGroup(group.slug, {
                name: group.name,
                password: formData.password,
                teacher_name: formData.teacher_name || null,
                email: formData.teacher_email || null,
                phone: formData.teacher_phone || null,
                teacher_photo: formData.teacher_photo || null,
                meal_plan_url: null,
                age_group: formData.age_group || null,
                hours: formData.hours || null,
                number_of_children: formData.number_of_children ? Number.parseInt(formData.number_of_children) : null,
                description: formData.description || null,
                contact_hours: formData.contact_hours || null,
                color: formData.color,
                documents: documents,
                schedule: group.schedule,
                teachers: teachers.filter(t => (t.name || "").trim().length > 0),
            });
            if (!result.success) {
                console.error("[v0] Error updating group:", result.error);
                throw new Error(result.error);
            }
            console.log("[v0] Group updated successfully");
            toast.success("Zapisano");
            router.push("/admin/groups");
            router.refresh();
        }
        catch (err) {
            console.error("[v0] Failed to update group:", err);
            setError(err instanceof Error ? err.message : "Wystąpił błąd");
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsx("form", { onSubmit: handleSubmit, children: _jsx(Card, { children: _jsxs(CardContent, { className: "p-6 space-y-6", children: [_jsxs("div", { className: "flex items-center gap-3 pb-4 border-b", children: [_jsx("div", { className: "w-12 h-12 rounded-lg", style: { backgroundColor: formData.color || "#E5E7EB" } }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: group.name }), _jsxs("p", { className: "text-sm text-gray-600", children: ["Slug: ", group.slug] })] })] }), error && (_jsx("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm", children: error })), _jsxs("div", { children: [_jsx("h4", { className: "font-medium text-gray-900 mb-4", children: "Has\u0142o dost\u0119pu" }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "password", children: "Has\u0142o *" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Input, { id: "password", type: showPassword ? "text" : "password", value: formData.password, onChange: (e) => setFormData({ ...formData, password: e.target.value }), required: true, minLength: 4, placeholder: "Wprowad\u017A has\u0142o dla grupy", className: "flex-1" }), _jsx(Button, { type: "button", variant: "outline", size: "sm", onClick: () => setShowPassword((v) => !v), children: showPassword ? "Ukryj" : "Pokaż" })] }), _jsx("p", { className: "text-xs text-gray-600 mt-1", children: "Minimalnie 4 znaki. Has\u0142o b\u0119dzie u\u017Cywane przez rodzic\u00F3w." })] })] }), _jsxs("div", { className: "border-t pt-6", children: [_jsx("h4", { className: "font-medium text-gray-900 mb-4", children: "Wygl\u0105d" }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "color", children: "Kolor grupy" }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx(Input, { id: "color", type: "color", value: formData.color, onChange: (e) => setFormData({ ...formData, color: e.target.value }), className: "w-20 h-10" }), _jsx("span", { className: "text-sm text-gray-600", children: formData.color })] }), _jsx("p", { className: "text-xs text-gray-600 mt-1", children: "Kolor u\u017Cywany w interfejsie grupy" })] })] }), _jsxs("div", { className: "border-t pt-6", children: [_jsx("h4", { className: "font-medium text-gray-900 mb-4", children: "Informacje o nauczycielu" }), _jsx("div", { className: "grid gap-6", children: _jsxs("div", { className: "flex items-start gap-6", children: [_jsxs("div", { className: "space-y-3", children: [_jsx(Label, { children: "Zdj\u0119cie nauczyciela" }), _jsx("div", { className: "relative w-32 h-32 bg-gray-100 rounded-full overflow-hidden border border-gray-200", children: formData.teacher_photo ? (_jsx(Image, { src: formData.teacher_photo || "/placeholder.svg", alt: "Nauczyciel", fill: true, className: "object-cover" })) : (_jsx("div", { className: "w-full h-full flex items-center justify-center text-gray-400", children: _jsx(Upload, { className: "w-8 h-8" }) })) }), _jsxs("label", { className: "block", children: [_jsx(Button, { type: "button", variant: "outline", size: "sm", disabled: uploadingPhoto, asChild: true, children: _jsx("span", { children: uploadingPhoto ? "Wgrywanie..." : "Zmień zdjęcie" }) }), _jsx("input", { type: "file", className: "hidden", accept: "image/*", onChange: (e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "photo"), disabled: uploadingPhoto })] })] }), _jsxs("div", { className: "flex-1 grid gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "teacher_name", children: "Imi\u0119 i nazwisko" }), _jsx(Input, { id: "teacher_name", value: formData.teacher_name, onChange: (e) => setFormData({ ...formData, teacher_name: e.target.value }), placeholder: "Pani Anna Kowalska" })] }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "teacher_email", children: "Email" }), _jsx(Input, { id: "teacher_email", type: "email", value: formData.teacher_email, onChange: (e) => setFormData({ ...formData, teacher_email: e.target.value }), placeholder: "anna.kowalska@nazaret.edu.pl" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "teacher_phone", children: "Telefon" }), _jsx(Input, { id: "teacher_phone", type: "tel", value: formData.teacher_phone, onChange: (e) => setFormData({ ...formData, teacher_phone: e.target.value }), placeholder: "+48 123 456 789", pattern: "^[+0-9\\s-]{6,}$" })] })] })] })] }) })] }), _jsxs("div", { className: "border-t pt-6", children: [_jsx("h4", { className: "font-medium text-gray-900 mb-4", children: "Dodatkowi nauczyciele (opcjonalnie)" }), _jsxs("div", { className: "space-y-4", children: [teachers.map((t, idx) => (_jsxs("div", { className: "grid md:grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: `teacher_${idx}_name`, children: "Imi\u0119 i nazwisko" }), _jsx(Input, { id: `teacher_${idx}_name`, value: t.name || "", onChange: (e) => {
                                                            const next = [...teachers];
                                                            next[idx] = { ...next[idx], name: e.target.value };
                                                            setTeachers(next);
                                                        }, placeholder: "np. Pani Maria Nowak" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: `teacher_${idx}_email`, children: "Email" }), _jsx(Input, { id: `teacher_${idx}_email`, type: "email", value: t.email || "", onChange: (e) => {
                                                            const next = [...teachers];
                                                            next[idx] = { ...next[idx], email: e.target.value };
                                                            setTeachers(next);
                                                        }, placeholder: "maria.nowak@nazaret.edu.pl" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: `teacher_${idx}_phone`, children: "Telefon" }), _jsx(Input, { id: `teacher_${idx}_phone`, type: "tel", value: t.phone || "", onChange: (e) => {
                                                            const next = [...teachers];
                                                            next[idx] = { ...next[idx], phone: e.target.value };
                                                            setTeachers(next);
                                                        }, placeholder: "+48 555 444 333", pattern: "^[+0-9\\s-]{6,}$" })] })] }, idx))), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { type: "button", variant: "outline", onClick: () => setTeachers((prev) => (prev.length < 2 ? [...prev, { name: "", email: "", phone: "" }] : prev)), disabled: teachers.length >= 2, children: "Dodaj kolejnego nauczyciela" }), _jsx(Button, { type: "button", variant: "ghost", onClick: () => setTeachers((prev) => (prev.length > 1 ? prev.slice(0, prev.length - 1) : prev)), disabled: teachers.length <= 1, children: "Usu\u0144 ostatniego" })] }), _jsx("p", { className: "text-xs text-gray-600", children: "Maksymalnie dw\u00F3ch dodatkowych nauczycieli." })] })] }), _jsxs("div", { className: "border-t pt-6", children: [_jsx("h4", { className: "font-medium text-gray-900 mb-4", children: "Informacje o grupie" }), _jsxs("div", { className: "grid gap-4", children: [_jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "age_group", children: "Grupa wiekowa" }), _jsx(Input, { id: "age_group", value: formData.age_group, onChange: (e) => setFormData({ ...formData, age_group: e.target.value }), placeholder: "np. 3-4 lata" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "number_of_children", children: "Liczba uczniów" }), _jsx(Input, { id: "number_of_children", type: "number", value: formData.number_of_children, onChange: (e) => setFormData({ ...formData, number_of_children: e.target.value }), placeholder: "np. 25" })] })] }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "hours", children: "Godziny pracy grupy" }), _jsx(Input, { id: "hours", value: formData.hours, onChange: (e) => setFormData({ ...formData, hours: e.target.value }), placeholder: "np. 7:00 - 17:00" }), _jsx("p", { className: "text-xs text-gray-600 mt-1", children: "Wpisz przedzia\u0142 godzin, np. 7:00\u201317:00" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "contact_hours", children: "Godziny kontaktu z nauczycielem" }), _jsx(Input, { id: "contact_hours", value: formData.contact_hours, onChange: (e) => setFormData({ ...formData, contact_hours: e.target.value }), placeholder: "np. 7:30-8:00 i 15:30-16:30" }), _jsx("p", { className: "text-xs text-gray-600 mt-1", children: "Mo\u017Cesz poda\u0107 kilka przedzia\u0142\u00F3w rozdzielonych przecinkami" })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "description", children: "Opis grupy" }), _jsx(Input, { id: "description", value: formData.description, onChange: (e) => setFormData({ ...formData, description: e.target.value }), placeholder: "Kr\u00F3tki opis grupy" }), _jsxs("p", { className: "text-xs text-gray-600 mt-1", children: [(formData.description || "").length, " znak\u00F3w"] })] })] })] }), _jsxs("div", { className: "border-t pt-6", children: [_jsx("h4", { className: "font-medium text-gray-900 mb-4", children: "Dokumenty do pobrania" }), _jsxs("div", { className: "space-y-4", children: [documents.map((doc, index) => (_jsxs("div", { className: "flex items-center gap-3 bg-gray-50 p-3 rounded-lg", children: [_jsx(FileText, { className: "w-5 h-5 text-gray-400" }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: doc.title }), _jsx("a", { href: doc.url, target: "_blank", rel: "noopener noreferrer", className: "text-xs text-blue-600 hover:underline", children: "Zobacz plik" })] }), _jsx(Button, { type: "button", variant: "ghost", size: "sm", onClick: () => removeDocument(index), children: _jsx(X, { className: "w-4 h-4 text-red-500" }) })] }, index))), _jsxs("div", { className: "flex gap-3 items-end p-4 border border-dashed rounded-lg", children: [_jsxs("div", { className: "flex-1", children: [_jsx(Label, { htmlFor: "new-doc-title", children: "Nazwa dokumentu" }), _jsx(Input, { id: "new-doc-title", value: newDocTitle, onChange: (e) => setNewDocTitle(e.target.value), placeholder: "np. Wyprawka" })] }), _jsxs("label", { children: [_jsxs(Button, { type: "button", variant: "secondary", disabled: uploadingDoc || !newDocTitle, children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), uploadingDoc ? "Wgrywanie..." : "Dodaj plik"] }), _jsx("input", { type: "file", className: "hidden", onChange: handleAddDocument, disabled: uploadingDoc || !newDocTitle, accept: ".pdf,.doc,.docx,.xls,.xlsx,.txt" })] })] })] })] }), _jsxs("div", { className: "flex gap-4 pt-6 border-t", children: [_jsxs(Button, { type: "submit", disabled: isLoading, children: [_jsx(Save, { className: "w-4 h-4 mr-2" }), isLoading ? "Zapisywanie..." : "Zapisz zmiany"] }), _jsx(Button, { type: "button", variant: "outline", asChild: true, children: _jsxs(Link, { href: "/admin/groups", children: [_jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }), "Powr\u00F3t"] }) })] })] }) }) }));
}
