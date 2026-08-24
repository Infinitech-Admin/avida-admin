import { Toaster } from "react-hot-toast";
import AdminAuth from "@/app/components/adminauth";
import SidebarWrapper from "../components/sidebarwrappper";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AdminAuth>
            <section className="flex min-h-screen bg-gray-100">
                {/* Sidebar (fixed drawer on mobile, sticky in-flow column on desktop) */}
                <SidebarWrapper />

                {/* Main Content */}
                <main className="flex-1 min-w-0 mt-16 lg:mt-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                    <Toaster position="bottom-right" reverseOrder={false} />
                    <div className="max-w-full">{children}</div>
                </main>
            </section>
        </AdminAuth>
    );
}