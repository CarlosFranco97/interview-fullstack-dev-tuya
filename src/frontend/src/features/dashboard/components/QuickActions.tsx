import { PaymentIcon, StatementIcon } from '@/components/common/Icons';
import { DashboardButton } from './DashboardButton';

interface QuickActionsProps {
    onPayCard: () => void;
    onViewStatements: () => void;
    isDisabled: boolean;
}

/**
 * Component for quick access buttons on the dashboard using unified DashboardButton.
 */
export const QuickActions = ({ onPayCard, onViewStatements, isDisabled }: QuickActionsProps) => {
    return (
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardButton
                icon={<PaymentIcon className="w-6 h-6" />}
                label="Pagar tarjeta"
                description="Realizar pago ahora"
                onClick={onPayCard}
                disabled={isDisabled}
                intent="red"
            />

            <DashboardButton
                icon={<StatementIcon className="w-6 h-6" />}
                label="Extractos"
                description="Ver movimientos"
                onClick={onViewStatements}
                intent="blue"
            />
        </section>

    );
};

