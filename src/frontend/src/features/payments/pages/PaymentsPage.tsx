import { useNavigate } from 'react-router-dom';
import { Button, Loading } from '@/components/common';
import { usePayments } from '../hooks/usePayments';
import { ROUTES } from '@/constants';
import { formatCurrency } from '@/utils/formatters';

export const PaymentsPage = () => {
    const navigate = useNavigate();
    const { payments, isLoading, error, getCardNumberFormatted } = usePayments();

    if (isLoading) return <div className="p-8 flex justify-center"><Loading /></div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Historial de pagos</h2>
                    <p className="text-gray-500">Revisa tus transacciones recientes</p>
                </div>
                <Button onClick={() => navigate(ROUTES.CREATE_PAYMENT)} className="bg-red-600 hover:bg-red-700 text-white">
                    + Realizar pago
                </Button>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg">
                    {error}
                </div>
            )}

            {!isLoading && payments.length === 0 && !error && (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-gray-500 mb-4">No tienes pagos registrados aún.</p>
                    <Button onClick={() => navigate(ROUTES.CREATE_PAYMENT)} variant="secondary">
                        Hacer mi primer pago
                    </Button>
                </div>
            )}

            {payments.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-500">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Descripción</th>
                                    <th className="px-6 py-4 font-semibold">Monto</th>
                                    <th className="px-6 py-4 font-semibold">Tarjeta</th>
                                    <th className="px-6 py-4 font-semibold">Fecha</th>
                                    <th className="px-6 py-4 font-semibold">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {payments.map((payment) => (
                                    <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {payment.description}
                                        </td>
                                        <td className="px-6 py-4 text-gray-900 font-semibold">
                                            {formatCurrency(payment.amount)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getCardNumberFormatted(payment.cardId)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString('es-CO', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            }) : 'Fecha no disponible'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium 
                                                ${payment.status?.toLowerCase() === 'completed' ? 'bg-green-100 text-green-700' :
                                                    payment.status?.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {payment.status?.toLowerCase() === 'completed' ? 'Exitoso' :
                                                    payment.status?.toLowerCase() === 'pending' ? 'Pendiente' : 'Fallido'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};
