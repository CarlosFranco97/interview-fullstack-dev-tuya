import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../layout/AuthLayout';
import { Button, Input, SideModal, ErrorIcon } from '@/components/common';
import * as authApi from '../api/authApi';
import { useState } from 'react';
import { ROUTES } from '@/constants';
import type { ApiError } from '@/types/apiTypes';
import { registerSchema, type RegisterForm } from '../schemas/authSchema';

export const RegisterPage = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterForm) => {
        try {
            setError(null);
            await authApi.register(data.username, data.email, data.password, data.fullName);
            navigate(ROUTES.DASHBOARD);
        } catch (err) {
            const error = err as ApiError;
            setError(error.message || 'Error al registrar usuario. Por favor verifique los datos.');
        }
    };

    return (
        <AuthLayout
            title="Crear cuenta"
            subtitle="Únete a la banca digital más segura y confiable"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

            <SideModal
                isOpen={!!error}
                onClose={() => setError(null)}
                title="Error de registro"
                type="error"
                icon={<ErrorIcon className="w-8 h-8 text-red-500" />}
                description={error || ''}
            >
                <p>No pudimos crear su cuenta en este momento. Verifique que el usuario o correo electrónico no estén ya en uso y que los datos ingresados sean correctos.</p>
            </SideModal>
        </AuthLayout>
    );
};

export default RegisterPage;
