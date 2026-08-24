import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminAuth({ children }: { children: React.ReactNode }) {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
        redirect("/auth/login");
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        });

        if (!response.ok) {
            throw new Error("Unauthorized");
        }
    } catch (error) {
        redirect("/auth/login");
    }

    return <>{children}</>;
}