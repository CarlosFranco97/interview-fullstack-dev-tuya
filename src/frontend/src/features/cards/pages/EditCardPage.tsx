import { Button, Input, Loading } from '@/components/common';
import { ROUTES } from '@/constants';
import { formatCurrency } from '@/utils/formatters';
import { useEditCard } from '../hooks/useEditCard';

/**
 * Page to edit an existing card.
 * Delegated all logic to the useEditCard hook.
 */
export const EditCardPage = () => {
    const {
        card,
        form,
        isLoading,
        serverError,
        onSubmit,
        navigate,
        isLimitTooLow,
        currentDebt
    } = useEditCard();

    const {
        register,
        formState: { errors, isSubmitting },
        watch
    } = form;

    const watchedValues = watch();

    if (isLoading) {
        return (
            <div className="flex justify-center p-12">
                <Loading variant="inline" />
            </div>
        );
    }

    if (!card) {
        return (
            <div className="p-8 text-center text-red-600">
                Tarjeta no encontrada
            </div>
        );
    }

    const limitErrorMessage = isLimitTooLow
        ? `El cupo no puede ser menor a la deuda actual (${formatCurrency(currentDebt)})`
        : errors.creditLimit?.message;

    return (
        <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-140px)]">
            <div className="flex-1 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-fit">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Editar tarjeta</h2>
                    <p className="text-gray-500">Modifica los detalles de tu producto financiero</p>
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
                        maxLength={20}
                        error={errors.holderName?.message}
                        {...register('holderName')}
                    />

                    <div className="grid grid-cols-1 gap-4">
                        <Input
                            label="Cupo total"
                            type="number"
                            placeholder="1000000"
                            onInput={(e) => {
                                if (e.currentTarget.value.length > 6) {
                                    e.currentTarget.value = e.currentTarget.value.slice(0, 6);
                                }
                            }}
                            error={limitErrorMessage}
                            {...register('creditLimit')}
                        />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button
                            type="button"
                            variant="secondary"
                            className="flex-1"
                            onClick={() => navigate(ROUTES.CARDS)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                            isLoading={isSubmitting}
                            disabled={isLimitTooLow}
                        >
                            Guardar cambios
                        </Button>
                    </div>
                </form>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <h3 className="text-gray-400 font-medium mb-8 uppercase tracking-widest text-sm">Vista Previa</h3>

                <div className="w-full max-w-[400px] h-[240px] bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl shadow-2xl shadow-gray-400 text-white p-6 relative overflow-hidden transition-all duration-300 transform hover:scale-105 flex flex-col justify-between">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-60 h-60 bg-black/10 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>

                    <div className="flex justify-between items-start relative z-10 w-full">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-9 bg-yellow-100/20 backdrop-blur-sm rounded-md border border-white/20 flex items-center justify-center">
                                <div className="w-8 h-[1px] bg-white/40 my-[2px]"></div>
                            </div>
                        </div>
                        <span className="font-bold text-lg italic tracking-tighter opacity-90 group-hover:scale-110 transition-transform">VISA</span>
                    </div>

                    <div className="flex flex-col justify-center relative z-10 w-full pl-2 flex-grow">
                        <p className="font-mono text-2xl tracking-widest text-shadow-md mb-1">
                            **** **** **** {card.cardNumber?.slice(-4) || '****'}
                        </p>
                        <p className="text-white/90 text-sm font-medium">
                            Cupo: {formatCurrency(Number(watchedValues.creditLimit || card.creditLimit))}
                        </p>
                    </div>

                    <div className="flex justify-between items-end relative z-10 w-full pb-1">
                        <div className="flex flex-col max-w-[70%]">
                            <p className="text-[10px] text-white/80 mb-0.5 uppercase tracking-widest font-semibold">Titular</p>
                            <p className="font-medium tracking-wide uppercase text-lg truncate text-white drop-shadow-sm leading-tight">
                                {watchedValues.holderName || card.holderName}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-white/80 mb-0.5 uppercase tracking-widest font-semibold">Vence</p>
                            <p className="font-medium tracking-wide text-lg text-white drop-shadow-sm leading-tight">
                                {new Date(card.expirationDate).toLocaleDateString('es-CO', { month: '2-digit', year: '2-digit' })}
                            </p>
                        </div>
                    </div>
                </div>
                <p className="mt-8 text-sm text-gray-500 text-center max-w-xs">
                    Solo puedes editar el nombre y el cupo. Para otros cambios, contacta soporte.
                </p>
            </div>
        </div>
    );
};

