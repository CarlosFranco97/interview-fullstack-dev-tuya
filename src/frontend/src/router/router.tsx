import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from './ProtectedRoute';
import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { DashboardPage } from '../features/dashboard/pages/DashboardPage';
import { CreateCardPage } from '../features/cards/pages/CreateCardPage';

// Temporary components (placeholders)
import { CardsPage } from '../features/cards/pages/CardsPage';
import { EditCardPage } from '../features/cards/pages/EditCardPage';

// Refactoring: Wrap each protected element individually for now for simplicity without changing the entire nested route structure yet
// Or create a wrapper component.
const ProtectedLayout = ({ children }: { children: React.ReactNode }) => (
    <ProtectedRoute>
        <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
);

import { PaymentsPage } from '../features/payments/pages/PaymentsPage';
import { CreatePaymentPage } from '../features/payments/pages/CreatePaymentPage';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/dashboard" replace />,
    },
    {
        path: '/login',
        element: (
            <PublicRoute>
                <LoginPage />
            </PublicRoute>
        ),
    },
    {
        path: '/register',
        element: (
            <PublicRoute>
                <RegisterPage />
            </PublicRoute>
        ),
    },
    {
        path: '/dashboard',
        element: (
            <ProtectedLayout>
                <DashboardPage />
            </ProtectedLayout>
        ),
    },
    {
        path: '/cards',
        element: (
            <ProtectedLayout>
                <CardsPage />
            </ProtectedLayout>
        ),
    },
    {
        path: '/cards/new',
        element: (
            <ProtectedLayout>
                <CreateCardPage />
            </ProtectedLayout>
        ),
    },
    {
        path: '/cards/edit/:id',
        element: (
            <ProtectedLayout>
                <EditCardPage />
            </ProtectedLayout>
        ),
    },
    {
        path: '/payments',
        element: (
            <ProtectedLayout>
                <PaymentsPage />
            </ProtectedLayout>
        ),
    },
    {
        path: '/payments/new',
        element: (
            <ProtectedLayout>
                <CreatePaymentPage />
            </ProtectedLayout>
        ),
    },
    {
        path: '*',
        element: <div className="p-8 flex items-center justify-center h-screen text-gray-500">404 - Page not found</div>,
    },
]);
