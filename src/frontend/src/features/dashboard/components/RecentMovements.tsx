import { Button, Loading } from '@/components/common';
import { formatCurrency } from '@/utils/formatters';
import type { Payment } from '@/features/payments/types/paymentTypes';
import { usePayments } from '@/features/payments/hooks/usePayments';

interface RecentMovementsProps {
    payments: Payment[];
    onViewHistory: () => void;
    getCardNumberFormatted: (cardId: string) => string;
}

/**
 * Component to display the latest payment transactions.
 */
export const RecentMovements = ({
    payments,
    onViewHistory,
    getCardNumberFormatted
}: RecentMovementsProps) => {
    const { isLoading } = usePayments();

    return (
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col min-h-[300px]">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Últimos movimientos</h3>
                {!isLoading && (
                    <Button variant="ghost" size="sm" onClick={onViewHistory}>
                        Ver historial
                    </Button>
                )}
            </div>

            <div className="flex-1 flex flex-col">
                {isLoading ? (
                    <Loading variant="inline" />
                ) : payments.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-gray-500 text-sm italic">No hay movimientos recientes</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {payments.slice(0, 5).map((payment) => (
                            <div key={payment.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold text-sm">
                                        {payment.description?.[0]?.toUpperCase() || 'P'}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{payment.description || 'Sin descripción'}</p>
                                        <p className="text-xs text-gray-500">
                                            Visa • {getCardNumberFormatted(payment.cardId)} • {new Date(payment.paymentDate).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })}
                                        </p>
                                    </div>
                                </div>
                                <p className="font-bold text-red-600">
                                    -{formatCurrency(payment.amount)}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

