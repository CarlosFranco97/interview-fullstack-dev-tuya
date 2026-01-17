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

const registerSchema = z.object({
    fullName: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
    username: z.string().min(3, 'El usuario debe tener al menos 3 caracteres'),
    email: z.string().email('Correo electrónico inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string().min(6, 'Confirma tu contraseña'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
});

type RegisterFilters = z.infer<typeof registerSchema>;

export const RegisterPage = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFilters>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFilters) => {
        try {
            setError(null);
            await authApi.register(data.username, data.email, data.password, data.fullName);
            navigate(ROUTES.DASHBOARD);
        } catch (err) {
            const error = err as ApiError;
            setError(error.message || 'Error al registrar usuario');
        } finally {
        }
    };

    return (
        <AuthLayout
            title="Crear cuenta"
            subtitle="Únete a la banca digital más segura y confiable"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
                        {error}
                    </div>
                )}

                <Input
                    label="Nombre completo"
                    placeholder="Juan Pérez"
                    error={errors.fullName?.message}
                    {...register('fullName')}
                />

                <Input
                    label="Usuario"
                    placeholder="juanperez123"
                    error={errors.username?.message}
                    {...register('username')}
                />

                <Input
                    label="Correo electrónico"
                    type="email"
                    placeholder="ejemplo@correo.com"
                    error={errors.email?.message}
                    {...register('email')}
                />

                <Input
                    label="Contraseña"
                    type="password"
                    placeholder="••••••••"
                    error={errors.password?.message}
                    {...register('password')}
                />

                <Input
                    label="Confirmar contraseña"
                    type="password"
                    placeholder="••••••••"
                    error={errors.confirmPassword?.message}
                    {...register('confirmPassword')}
                />

                <Button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 font-semibold shadow-red-200 mt-2"
                    isLoading={isSubmitting}
                >
                    Crear mi cuenta
                </Button>

                <div className="text-center pt-2">
                    <p className="text-gray-600 text-sm">
                        ¿Ya tienes una cuenta?{' '}
                        <Link to={ROUTES.LOGIN} className="text-red-600 hover:text-red-700 font-semibold transition-colors">
                            Inicia sesión aquí
                        </Link>
                    </p>
                </div>
            </form>
        </AuthLayout>
    );
};

export default RegisterPage;
