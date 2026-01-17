import type { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Logo, HomeIcon, CreditCardIcon, CurrencyIcon, LogoutIcon, BellIcon } from '../common';
import * as authApi from '@/features/auth/api/authApi';
import { ROUTES } from '@/constants';

interface DashboardLayoutProps {
    children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    const { user } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await authApi.logout();
        navigate(ROUTES.LOGIN);
    };

    const navItems = [
        {
            label: 'Inicio', path: ROUTES.DASHBOARD, icon: <HomeIcon />
        },
        {
            label: 'Mis tarjetas', path: ROUTES.CARDS, icon: <CreditCardIcon />
        },
        {
            label: 'Pagos', path: ROUTES.PAYMENTS, icon: <CurrencyIcon />
        },
    ];

    return (
        <div className="flex h-screen bg-slate-50">
            <aside className="w-64 bg-white border-r border-gray-100 flex-shrink-0 flex flex-col fixed h-full z-10">
                <div className="h-20 flex items-center px-8 border-b border-gray-50">
                    <Logo className="h-8" />
                </div>

                <nav className="flex-1 px-4 py-8 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${isActive
                                    ? 'bg-red-50 text-red-600'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                }`
                            }
                        >
                            {item.icon}
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-50">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-gray-500 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                        <LogoutIcon />
                        Cerrar sesión
                    </button>
                </div>
            </aside>

            <div className="flex-1 flex flex-col ml-64 min-w-0">
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex flex-col">
                        <h1 className="text-xl font-bold text-gray-900">
                            Hola, {user?.name?.split(' ')[0] || 'Usuario'}
                        </h1>
                        <p className="text-sm text-gray-500">Bienvenido a tu banca virtual</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                            <BellIcon className="w-6 h-6" />
                        </button>
                        <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold border border-gray-200">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-8 overflow-y-auto">
                    <div className="max-w-5xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};
