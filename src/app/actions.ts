"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createPost(formData: FormData) {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const type = formData.get("type") as string || "news";
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    try {
        const post = await prisma.post.create({
            data: {
                title,
                content,
                excerpt: content.slice(0, 150) + "...",
                slug: slug + "-" + Date.now(), // Ensure unique slug for demo
                type,
                status: "published",
                published: true,
            }
        });

        revalidatePath("/");
        return { success: true, post };
    } catch (error: any) {
        console.error("Error creating post:", error);
        return { success: false, error: error.message };
    }
}

export async function getPosts() {
    try {
        const posts = await prisma.post.findMany({
            orderBy: { createdAt: 'desc' },
            take: 10,
        });
        return posts;
    } catch (error) {
        console.error("Error fetching posts:", error);
        return [];
    }
}
