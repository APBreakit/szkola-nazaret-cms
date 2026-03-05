"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { deleteGroup } from "@/app/actions/admin-actions";
import { toast } from "sonner";
export default function GroupDeleteButton({ slug }) {
    const [loading, setLoading] = useState(false);
    const onDelete = async () => {
        if (!confirm("Czy na pewno chcesz usunąć tę grupę?"))
            return;
        setLoading(true);
        const res = await deleteGroup(slug);
        setLoading(false);
        if (res?.success) {
            toast.success("Grupa usunięta");
            window.location.reload();
        }
        else {
            toast.error(res?.error || "Błąd podczas usuwania grupy");
        }
    };
    return (_jsx(Button, { type: "button", variant: "outline", size: "sm", onClick: onDelete, disabled: loading, children: "Usu\u0144" }));
}
