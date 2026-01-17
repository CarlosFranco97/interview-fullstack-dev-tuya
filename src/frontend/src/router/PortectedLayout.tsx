import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProtectedRoute } from "./ProtectedRoute";

export const ProtectedLayout = ({ children }: { children: React.ReactNode }) => (
    <ProtectedRoute>
        <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
);