"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addGalleryImage, deleteGalleryImage, moveGalleryImage } from "@/app/actions/admin-actions";
import { useRouter } from "next/navigation";
import { Plus, Trash2, MoveUp, MoveDown, Loader2, Upload } from "lucide-react";
import { optimizeImage } from "@/lib/utils/image-optimizer";
import { toast } from "sonner";
export default function GalleryImagesManager({ galleryId, images, }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [newImageUrl, setNewImageUrl] = useState("");
    const [newImageCaption, setNewImageCaption] = useState("");
    const [uploading, setUploading] = useState(false);
    const handleFileUpload = async (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0)
            return;
        setUploading(true);
        const maxOrder = images.length > 0 ? Math.max(...images.map((img) => (img.sort_order ?? 0))) : 0;
        let currentOrder = maxOrder + 1;
        let successCount = 0;
        try {
            for (const file of files) {
                if (!file.type.startsWith("image/"))
                    continue;
                // Optimize image
                const optimizedFile = await optimizeImage(file, 1920, 0.85);
                // Upload to Blob
                const formData = new FormData();
                formData.append("file", optimizedFile);
                const response = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });
                if (!response.ok) {
                    console.error(`Failed to upload ${file.name}`);
                    continue;
                }
                const data = await response.json();
                const result = await addGalleryImage(galleryId, data.url, null, currentOrder++);
                if (result.success)
                    successCount++;
            }
            if (successCount > 0) {
                toast.success("Zapisano");
                router.refresh();
            }
            else {
                toast.error("Błąd");
            }
        }
        catch (error) {
            console.error("Error uploading images:", error);
            toast.error("Błąd");
        }
        finally {
            setUploading(false);
        }
    };
    const handleAddImage = async () => {
        if (!newImageUrl.trim())
            return;
        setLoading(true);
        const maxOrder = images.length > 0 ? Math.max(...images.map((img) => (img.sort_order ?? 0))) : 0;
        const result = await addGalleryImage(galleryId, newImageUrl, newImageCaption || null, maxOrder + 1);
        if (!result.success) {
            console.error("Error adding image:", result.error);
            toast.error("Błąd");
        }
        else {
            setNewImageUrl("");
            setNewImageCaption("");
            toast.success("Zapisano");
            router.refresh();
        }
        setLoading(false);
    };
    const handleDeleteImage = async (id) => {
        if (!confirm("Czy na pewno chcesz usunąć to zdjęcie?"))
            return;
        const result = await deleteGalleryImage(id, galleryId);
        if (!result.success) {
            console.error("Error deleting image:", result.error);
            toast.error("Błąd");
        }
        else {
            toast.success("Usunięto");
            router.refresh();
        }
    };
    const handleMoveImage = async (id, direction) => {
        const currentIndex = images.findIndex((img) => img.id === id);
        if (currentIndex === -1)
            return;
        if (direction === "up" && currentIndex === 0)
            return;
        if (direction === "down" && currentIndex === images.length - 1)
            return;
        const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
        const currentImage = images[currentIndex];
        const targetImage = images[targetIndex];
        const curOrder = currentImage.sort_order ?? currentIndex;
        const tgtOrder = targetImage.sort_order ?? targetIndex;
        await moveGalleryImage(currentImage.id, curOrder, tgtOrder, galleryId);
        router.refresh();
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "border rounded-lg p-4 bg-gray-50", children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-3", children: "Dodaj nowe zdj\u0119cia" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { className: "mb-2 block", children: "Wgraj z komputera" }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("label", { className: "cursor-pointer", children: [_jsxs(Button, { variant: "outline", type: "button", disabled: uploading, className: "pointer-events-none bg-transparent", children: [uploading ? _jsx(Loader2, { className: "w-4 h-4 mr-2 animate-spin" }) : _jsx(Upload, { className: "w-4 h-4 mr-2" }), uploading ? "Wgrywanie..." : "Wybierz pliki"] }), _jsx("input", { type: "file", multiple: true, accept: "image/*", onChange: handleFileUpload, className: "hidden", disabled: uploading })] }), _jsx("span", { className: "text-sm text-gray-500", children: "Mo\u017Cesz wybra\u0107 wiele plik\u00F3w jednocze\u015Bnie" })] })] }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-0 flex items-center", children: _jsx("span", { className: "w-full border-t" }) }), _jsx("div", { className: "relative flex justify-center text-xs uppercase", children: _jsx("span", { className: "bg-gray-50 px-2 text-gray-500", children: "Lub dodaj z URL" }) })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "image_url", children: "URL zdj\u0119cia" }), _jsx(Input, { id: "image_url", value: newImageUrl, onChange: (e) => setNewImageUrl(e.target.value), placeholder: "https://...", disabled: loading || uploading })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "image_caption", children: "Podpis (opcjonalny)" }), _jsx(Input, { id: "image_caption", value: newImageCaption, onChange: (e) => setNewImageCaption(e.target.value), placeholder: "Opis zdj\u0119cia...", disabled: loading || uploading })] }), _jsxs(Button, { onClick: handleAddImage, disabled: loading || uploading || !newImageUrl.trim(), children: [loading ? _jsx(Loader2, { className: "w-4 h-4 mr-2 animate-spin" }) : _jsx(Plus, { className: "w-4 h-4 mr-2" }), "Dodaj z URL"] })] })] })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: images.map((image, index) => (_jsxs("div", { className: "border rounded-lg overflow-hidden", children: [_jsx("div", { className: "aspect-square bg-gray-100 relative", children: _jsx("img", { src: image.image_url || "/placeholder.svg", alt: image.caption || "", className: "w-full h-full object-cover" }) }), _jsxs("div", { className: "p-3 space-y-2", children: [image.caption && _jsx("p", { className: "text-sm text-gray-700", children: image.caption }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Button, { variant: "outline", size: "sm", onClick: () => handleMoveImage(image.id, "up"), disabled: index === 0, children: _jsx(MoveUp, { className: "w-4 h-4" }) }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => handleMoveImage(image.id, "down"), disabled: index === images.length - 1, children: _jsx(MoveDown, { className: "w-4 h-4" }) }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => handleDeleteImage(image.id), className: "ml-auto", children: _jsx(Trash2, { className: "w-4 h-4 text-red-600" }) })] })] })] }, image.id))) }), images.length === 0 && (_jsx("div", { className: "text-center py-12 text-gray-500", children: _jsx("p", { children: "Brak zdj\u0119\u0107 w galerii. Dodaj pierwsze zdj\u0119cie powy\u017Cej." }) }))] }));
}
