import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../layout/AuthLayout';
import { Button, Input } from '@/components/common';
import * as authApi from '../api/authApi';
import { useState } from 'react';
import { ROUTES } from '@/constants';
import type { ApiError } from '@/types/apiTypes';

const loginSchema = z.object({
    username: z.string().min(1, 'El usuario es requerido'),
    password: z.string().min(1, 'La contraseña es requerida'),
});

type LoginFilters = z.infer<typeof loginSchema>;

export const LoginPage = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFilters>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFilters) => {
        try {
            setError(null);
            await authApi.login(data.username, data.password);
            navigate(ROUTES.DASHBOARD);
        } catch (err) {
            const error = err as ApiError;
            setError(error.message || 'Credenciales inválidas');
        }
    };

    return (
        <AuthLayout
            title="Bienvenido de nuevo"
            subtitle="Ingresa tus credenciales para acceder a tu banca en línea"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <Input
                        label="Usuario"
                        type="text"
                        placeholder="Ingrese su usuario"
                        error={errors.username?.message}
                        {...register('username')}
                    />

                    <div className="space-y-1">
                        <Input
                            label="Contraseña"
                            type="password"
                            placeholder="••••••••"
                            error={errors.password?.message}
                            {...register('password')}
                        />
                        <div className="flex justify-end">
                            <Link to="#" className="text-sm text-red-600 hover:text-red-700 font-medium">
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 font-semibold shadow-red-200"
                    isLoading={isSubmitting}
                >
                    Iniciar sesión
                </Button>

                <div className="text-center pt-2">
                    <p className="text-gray-600 text-sm">
                        ¿No tienes una cuenta?{' '}
                        <Link to={ROUTES.REGISTER} className="text-red-600 hover:text-red-700 font-semibold transition-colors">
                            Abre tu cuenta hoy
                        </Link>
                    </p>
                </div>
            </form>
        </AuthLayout>
    );
};

export default LoginPage;
