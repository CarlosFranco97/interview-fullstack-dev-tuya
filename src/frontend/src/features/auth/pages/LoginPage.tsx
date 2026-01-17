import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../layout/AuthLayout';
import { Button, Input, SideModal, ErrorIcon } from '@/components/common';
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
            setError(error.message || 'Credenciales inválidas. Por favor verifique sus datos.');
        }
    };

    return (
        <AuthLayout
            title="Bienvenido de nuevo"
            subtitle="Ingresa tus credenciales para acceder a tu banca en línea"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

            <SideModal
                isOpen={!!error}
                onClose={() => setError(null)}
                title="Error de acceso"
                type="error"
                icon={<ErrorIcon className="w-8 h-8 text-red-500" />}
                description={error || ''}
            >
                <p>Asegúrese de que su usuario y contraseña sean correctos. Si el problema persiste, intente restablecer su contraseña.</p>
            </SideModal>
        </AuthLayout>
    );
};

export default LoginPage;
