import { Button } from '@/components/common';
import { formatCurrency, formatCardNumber } from '@/utils/formatters';
import { SignalIcon, PlusIcon } from '@/components/common/Icons';
import { DashboardButton } from './DashboardButton';
import type { Card } from '@/features/cards/types/cardTypes';

interface CardCarouselProps {
    cards: Card[];
    isLoading: boolean;
    onViewAll: () => void;
    onAddNew: () => void;
}

/**
 * Component to display a horizontal scrollable list of user cards.
 */
export const CardCarousel = ({ cards, isLoading, onViewAll, onAddNew }: CardCarouselProps) => {
    return (
        <section>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Mis tarjetas</h2>
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={onViewAll}
                >
                    Ver todas
                </Button>
            </div>

            <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                {isLoading ? (
                    <>
                        <div className="min-w-[320px] h-[200px] bg-gray-100 animate-pulse rounded-2xl snap-center border border-gray-100"></div>
                        <div className="min-w-[320px] h-[200px] bg-gray-100 animate-pulse rounded-2xl snap-center border border-gray-100"></div>
                    </>
                ) : (
                    <>
                        {cards.length === 0 && (
                            <div className="min-w-[320px] h-[200px] flex flex-col items-center justify-center bg-gray-50 rounded-2xl border border-dashed border-gray-300 text-gray-500 snap-center">
                                <p>No tienes tarjetas activas</p>
                            </div>
                        )}

                        {cards.map((card) => (
                            <div
                                key={card.id}
                                className="min-w-[320px] h-[200px] bg-gradient-to-br from-red-600 to-red-800 rounded-2xl shadow-xl shadow-red-200 text-white p-6 relative overflow-hidden transform hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between snap-center group"
                            >
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                                <div className="flex justify-between items-start w-full relative z-10">
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-8 bg-yellow-100/20 backdrop-blur-sm rounded-md border border-white/20 flex items-center justify-center">
                                            <div className="w-full h-[1px] bg-white/30 my-[2px]"></div>
                                        </div>
                                        <SignalIcon className="text-white/80" />
                                    </div>
                                    <span className="font-bold text-lg italic tracking-tighter opacity-90 group-hover:scale-110 transition-transform">VISA</span>
                                </div>

                                <div className="flex flex-col justify-center w-full relative z-10 px-1">
                                    <p className="font-mono text-xl tracking-widest text-shadow-sm mb-1">{formatCardNumber(card.cardNumber)}</p>
                                    {card.balance !== undefined && (
                                        <p className="text-sm text-white/90 font-medium">Saldo: {formatCurrency(card.balance)}</p>
                                    )}
                                    {card.creditLimit > 0 && (
                                        <p className="text-sm text-white/80">Cupo: {formatCurrency(card.creditLimit)}</p>
                                    )}
                                </div>

                                <div className="flex justify-between items-end w-full relative z-10">
                                    <div>
                                        <p className="text-xs text-white/80 mb-1 uppercase tracking-wider font-semibold">Titular</p>
                                        <p className="font-medium tracking-wide uppercase truncate max-w-[150px] text-white drop-shadow-sm leading-tight">{card.holderName}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-white/80 mb-1 uppercase tracking-wider font-semibold">Vence</p>
                                        <p className="font-medium tracking-wide text-white drop-shadow-sm leading-tight">
                                            {new Date(card.expirationDate).toLocaleDateString('es-CO', { month: '2-digit', year: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <DashboardButton
                            variant="vertical"
                            icon={<PlusIcon className="w-5 h-5" />}
                            label="Nueva"
                            onClick={onAddNew}
                        />
                    </>
                )}
            </div>
        </section>
    );
};

