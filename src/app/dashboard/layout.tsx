import { Sidebar } from "@/components/dashboard/sidebar";
import { DashboardErrorBoundary } from "@/components/error-boundary";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-8">
                <DashboardErrorBoundary>
                    {children}
                </DashboardErrorBoundary>
            </main>
        </div>
    );
}
