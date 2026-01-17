import { useWatch } from 'react-hook-form';
import { Button, Input, Loading } from '@/components/common';
import { formatCurrency } from '@/utils/formatters';
import { useCreateCard } from '../hooks/useCreateCard';
import { useAuthStore } from '@/store/authStore';

/**
 * Page to create a new card.
 * Delegated all logic to the useCreateCard hook.
 */
export const CreateCardPage = () => {
    const { user } = useAuthStore();
    const {
        form,
        isCheckingEligibility,
        serverError,
        onSubmit,
        navigate
    } = useCreateCard();

    const {
        register,
        control,
        formState: { errors, isSubmitting },
    } = form;

    const watchedValues = useWatch({ control });

    const previewExpiryDate = (() => {
        const d = new Date();
        d.setFullYear(d.getFullYear() + 5);
        return d.toLocaleDateString('es-CO', { month: '2-digit', year: '2-digit' });
    })();

    if (isCheckingEligibility) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-140px)]">
                <Loading variant="inline" />
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-140px)]">
            <div className="flex-1 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-fit">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Agregar nueva tarjeta</h2>
                    <p className="text-gray-500">Ingresa los detalles de tu producto financiero</p>
                </div>

                {serverError && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                        {serverError}
                    </div>
                )}

                <form onSubmit={onSubmit} className="space-y-5">
                    <Input
                        label="Nombre del titular"
                        placeholder="NOMBRE APELLIDO"
                        error={errors.holderName?.message}
                        {...register('holderName')}
                    />

                    <div className="grid grid-cols-1 gap-4">
                        <Input
                            label="Cupo total"
                            type="number"
                            placeholder="1000000"
                            error={errors.creditLimit?.message}
                            {...register('creditLimit')}
                        />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button
                            type="button"
                            variant="secondary"
                            className="flex-1"
                            onClick={() => navigate(-1)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                            isLoading={isSubmitting}
                        >
                            Guardar tarjeta
                        </Button>
                    </div>
                </form>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <h3 className="text-gray-400 font-medium mb-8 uppercase tracking-widest text-sm">Vista Previa</h3>

                <div className="w-full max-w-[400px] h-[240px] bg-gradient-to-br from-red-600 to-red-800 rounded-2xl shadow-2xl shadow-red-200 text-white p-6 relative overflow-hidden transition-all duration-300 transform hover:scale-105 flex flex-col justify-between">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-60 h-60 bg-black/10 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>

                    <div className="flex justify-between items-start relative z-10 w-full">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-9 bg-yellow-100/20 backdrop-blur-sm rounded-md border border-white/20 flex items-center justify-center">
                                <div className="w-8 h-[1px] bg-white/40 my-[2px]"></div>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                            </svg>
                        </div>
                        <span className="font-bold text-lg italic tracking-tighter opacity-90 group-hover:scale-110 transition-transform">VISA</span>
                    </div>

                    <div className="flex flex-col justify-center relative z-10 w-full pl-2 flex-grow">
                        <p className="font-mono text-2xl tracking-widest text-shadow-md mb-1">
                            **** **** **** ****
                        </p>
                        {watchedValues.creditLimit && (
                            <p className="text-white/90 text-sm font-medium">
                                Cupo: {formatCurrency(Number(watchedValues.creditLimit))}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-between items-end relative z-10 w-full pb-1">
                        <div className="flex flex-col max-w-[70%]">
                            <p className="text-[10px] text-white/80 mb-0.5 uppercase tracking-widest font-semibold">Titular</p>
                            <p className="font-medium tracking-wide uppercase text-lg truncate text-white drop-shadow-sm leading-tight">
                                {watchedValues.holderName || user?.name || 'NOMBRE APELLIDO'}
                            </p>
                        </div>
                        <div className="flex flex-col items-end">
                            <p className="text-[10px] text-white/80 mb-0.5 uppercase tracking-widest font-semibold">Vence</p>
                            <p className="font-medium tracking-wide text-lg text-right text-white drop-shadow-sm leading-tight">
                                {previewExpiryDate}
                            </p>
                        </div>
                    </div>
                </div>

                <p className="mt-8 text-sm text-gray-500 text-center max-w-xs">
                    Esta es una representación visual de cómo se verá tu tarjeta en la plataforma.
                </p>
            </div>
        </div>
    );
};

