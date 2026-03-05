import { sql } from "@/lib/db";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
const JWT_SECRET = (() => {
    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret && process.env.NODE_ENV === "production") {
        throw new Error("NEXTAUTH_SECRET is required in production");
    }
    return new TextEncoder().encode(secret || "fallback-secret-for-dev-only-change-in-production");
})();
export async function createSession(userId, email, name, role) {
    const token = await new SignJWT({ userId, email, name, role })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("7d")
        .sign(JWT_SECRET);
    const cookieStore = await cookies();
    cookieStore.set("session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
    });
    return token;
}
export async function getSession() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("session")?.value;
        if (!token)
            return null;
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return {
            user: {
                id: payload.userId,
                email: payload.email,
                role: payload.role,
                name: payload.name,
            },
        };
    }
    catch (error) {
        console.error("Invalid session:", error);
        return null;
    }
}
export async function deleteSession() {
    const cookieStore = await cookies();
    cookieStore.delete("session");
}
export async function verifyCredentials(email, password) {
    const users = await sql `
    SELECT * FROM users WHERE email = ${email} LIMIT 1
  `;
    const user = users[0];
    if (!user || !user.password)
        return null;
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid)
        return null;
    return {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
    };
}
