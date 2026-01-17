import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Loading, SideModal, ErrorIcon } from '@/components/common';
import { ROUTES } from '@/constants';
import { formatCurrency } from '@/utils/formatters';
import { useCards } from '../hooks/useCards';

/**
 * Page to list and manage user cards.
 * Delegated all logic to the useCards hook.
 */
export const CardsPage = () => {
    const navigate = useNavigate();
    const { cards, isLoading, error, deleteCard, fetchCards } = useCards();

    // State for deletion
    const [cardIdToDelete, setCardIdToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteClick = (id: string) => {
        setCardIdToDelete(id);
    };

    const handleConfirmDelete = async () => {
        if (!cardIdToDelete) return;
        setIsDeleting(true);
        const success = await deleteCard(cardIdToDelete);
        setIsDeleting(false);
        if (success) {
            setCardIdToDelete(null);
            await fetchCards();
        }
    };

    if (isLoading) {
        return (
            <div className="p-8 flex justify-center">
                <Loading variant="inline" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Mis tarjetas</h2>
                    <p className="text-gray-500">Administra tus tarjetas de crédito y débito</p>
                </div>
                <Button
                    disabled={cards.length >= 3}
                    onClick={() => navigate(ROUTES.CREATE_CARD)}
                    className="bg-red-600 hover:bg-red-700 text-white"
                >
                    + Nueva tarjeta
                </Button>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg">
                    {error}
                </div>
            )}

            {cards.length === 0 && !error && (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-gray-500 mb-4">No tienes tarjetas registradas aún.</p>
                    <Button onClick={() => navigate(ROUTES.CREATE_CARD)} variant="secondary">
                        Crear mi primera tarjeta
                    </Button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {cards.map((card) => (
                    <div key={card.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between transition-all hover:shadow-md">
                        <div>
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                                    <span className="text-xs font-bold text-gray-500">Tarjeta</span>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${card.status === 'blocked' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                    {card.status === 'blocked' ? 'Bloqueada' : 'Activa'}
                                </span>
                            </div>

                            <div className="mb-4">
                                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Número</p>
                                <p className="text-xl font-mono text-gray-800 tracking-wider">
                                    **** **** **** {card.cardNumber?.slice(-4) || '****'}
                                </p>
                            </div>

                            <div className="flex justify-between mb-6">
                                <div>
                                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Titular</p>
                                    <p className="font-medium text-gray-900 truncate max-w-[140px]">{card.holderName}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Vence</p>
                                    <p className="font-medium text-gray-900">
                                        {new Date(card.expirationDate).toLocaleDateString('es-CO', { month: '2-digit', year: '2-digit' })}
                                    </p>
                                </div>
                            </div>

                            <div className="mb-6 pt-4 border-t border-gray-50">
                                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Cupo Total</p>
                                <p className="text-lg font-bold text-gray-900">
                                    {formatCurrency(card.creditLimit)}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-2">
                            <Button
                                variant="secondary"
                                className="flex-1 text-sm py-2"
                                onClick={() => navigate(ROUTES.EDIT_CARD.replace(':id', card.id || ''))}
                            >
                                Editar
                            </Button>
                            <Button
                                onClick={() => card.id && handleDeleteClick(card.id)}
                                className="flex-1 bg-red-500 border border-red-200 text-white hover:bg-red-100 text-sm py-2"
                            >
                                Eliminar
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <SideModal
                isOpen={!!cardIdToDelete}
                onClose={() => setCardIdToDelete(null)}
                title="¿Eliminar tarjeta?"
                description="¿Estás seguro de que deseas eliminar esta tarjeta?"
                type="danger"
                icon={<ErrorIcon className="w-8 h-8 text-red-500" />}
                onConfirm={handleConfirmDelete}
                isLoading={isDeleting}
                confirmText="Sí, eliminar"
                cancelText="No, mantener"
            >
                <p>Esta acción es permanente y no podrá recuperar el acceso a esta tarjeta una vez eliminada. Asegúrese de liquidar cualquier saldo pendiente.</p>
            </SideModal>
        </div>
    );
};

