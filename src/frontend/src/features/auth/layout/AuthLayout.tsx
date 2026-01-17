import type { ReactNode } from 'react';
import { Logo, SecurityBadge } from '@/components/common';

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    subtitle: string;
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-[1000px] w-full bg-white rounded-2xl shadow-xl overflow-hidden flex min-h-[600px]">
                <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <div className="mb-8">
                        <Logo className='h-12 mb-5' />
                        <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">{title}</h1>
                        <p className="text-gray-500">{subtitle}</p>
                    </div>

                    {children}

                    <div className="mt-8 text-center text-sm text-gray-400">
                        © 2026 Tuya S.A. Todos los derechos reservados.
                    </div>
                </div>

                <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-red-600 to-red-800 relative p-12 flex-col text-white justify-between relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M0 100 L100 0 L100 100 Z" fill="white" />
                        </svg>
                    </div>

                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-4">Banca digital segura</h2>
                        <p className="text-red-100 text-lg">Gestiona tus productos financieros con la seguridad y confianza que necesitas.</p>
                    </div>


                    <SecurityBadge className="mb-3" />
                </div>
            </div>
        </div>
    );
};
