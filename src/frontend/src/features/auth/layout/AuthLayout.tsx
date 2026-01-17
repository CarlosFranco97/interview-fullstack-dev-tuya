import type { ReactNode } from 'react';
import { Logo } from '@/components/common/Logo';

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
                        © 2026 Tuya Bank. Todos los derechos reservados.
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

                    <div className="relative z-10 bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                        <div className="flex items-center gap-4 mb-3">
                            <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-semibold text-white">Seguridad garantizada</p>
                                <p className="text-xs text-red-100">Tus datos siempre protegidos</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
