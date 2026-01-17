import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Loading } from '@/components/common';
import { useCreatePayment } from '../hooks/useCreatePayment';
import { createPaymentSchema, type CreatePaymentForm } from '../schemas/paymentSchema';
import { ROUTES } from '@/constants';
import type { Card } from '@/features/cards/types/cardTypes';
import { formatCurrency } from '@/utils/formatters';

export const CreatePaymentPage = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<CreatePaymentForm>({
        resolver: zodResolver(createPaymentSchema),
    });

    const {
        cards,
        isLoadingCards,
        serverError,
        setServerError,
        selectedCard,
        watchedAmount,
        processPayment
    } = useCreatePayment(control, setValue);

    const onSubmit = async (data: CreatePaymentForm) => {
        try {
            setServerError(null);
            await processPayment(data.cardId, data.amount, data.description);
            navigate(ROUTES.PAYMENTS);
        } catch (err: unknown) {
            console.error('Error al crear el pago:', err);
        }
    };

    if (isLoadingCards) return <div className="p-12 flex justify-center"><Loading /></div>;

    if (cards.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-sm border border-dashed border-gray-200">
                <p className="text-gray-500 mb-4">Necesitas una tarjeta activa para realizar pagos.</p>
                <Button onClick={() => navigate(ROUTES.CREATE_CARD)}>
                    Solicitar Tarjeta
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-140px)]">
            <div className="flex-1 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-fit">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Realizar pago</h2>
                    <p className="text-gray-500">Completa los datos de la transacción</p>
                </div>

                {serverError && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Selecciona tu tarjeta</label>
                        <select
                            {...register('cardId')}
                            className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none"
                        >
                            {cards.map((card: Card) => (
                                <option key={card.id} value={card.id} disabled={card.balance === 0}>
                                    Visa terminada en {card.cardNumber?.slice(-4)} - {card.holderName} {card.balance === 0 ? '(Sin saldo)' : ''}
                                </option>
                            ))}
                        </select>
                        {errors.cardId && <p className="text-sm text-red-500 mt-1">{errors.cardId.message}</p>}
                    </div>

                    <Input
                        label="Monto a pagar"
                        type="number"
                        placeholder="0.00"
                        min="1"
                        step="0.01"
                        className="font-bold text-lg"
                        error={errors.amount?.message}
                        {...register('amount', { valueAsNumber: true })}
                        onInput={(e: React.FormEvent<HTMLInputElement>) => {
                            const target = e.target as HTMLInputElement;
                            let value = target.value;
                            if (value.length > 12) {
                                value = value.slice(0, 12);
                            }
                            if (selectedCard && Number(value) > (selectedCard.balance || 0)) {
                                value = selectedCard.balance?.toString() || '';
                                setValue('amount', selectedCard.balance || 0);
                            }
                            target.value = value;
                        }}
                    />

                    <Input
                        label="Descripción"
                        placeholder="Ej: Compra supermercado (opcional)"
                        {...register('description')}
                        maxLength={50}
                    />

                    <div className="pt-4 flex gap-3">
                        <Button
                            type="button"
                            variant="secondary"
                            className="flex-1"
                            onClick={() => navigate(ROUTES.PAYMENTS)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                            isLoading={isSubmitting}
                            disabled={isSubmitting || !watchedAmount || selectedCard?.balance === 0}
                        >
                            Pagar
                        </Button>
                    </div>
                </form>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <h3 className="text-gray-400 font-medium mb-8 uppercase tracking-widest text-sm">Resumen de transacción</h3>

                {selectedCard ? (
                    <div className="w-full max-w-[320px] bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-red-600"></div>

                        <div className="flex justify-between items-center mb-6">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tarjeta Origen</span>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                <span className="text-xs font-medium text-gray-600">Activa</span>
                            </div>
                        </div>

                        <p className="text-gray-900 font-mono text-lg mb-1">**** **** **** {selectedCard.cardNumber?.slice(-4)}</p>
                        <p className="text-gray-500 text-sm mb-6">{selectedCard.holderName}</p>

                        <div className="border-t border-gray-100 pt-4 mb-4 space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-500 text-sm">Cupo total</span>
                                <span className="text-gray-900 font-medium">{formatCurrency(selectedCard.creditLimit || 0)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 text-sm">Saldo total</span>
                                <span className="text-gray-900 font-medium">{formatCurrency(selectedCard.balance || 0)}</span>
                            </div>
                        </div>

                        <div className="bg-red-50 p-4 rounded-xl flex justify-between items-center mt-4">
                            <span className="text-red-800 font-medium text-sm">Total a pagar</span>
                            <span className="text-red-700 font-bold text-lg truncate">
                                {formatCurrency(Number(watchedAmount || 0))}
                            </span>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-400">Selecciona una tarjeta para ver detalles</p>
                )}

                <p className="mt-8 text-sm text-gray-500 text-center max-w-xs">
                    El pago se procesará inmediatamente y se descontará de tu cupo disponible.
                </p>
            </div>
        </div>
    );
};
