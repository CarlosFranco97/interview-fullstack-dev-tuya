import { useDashboard } from '../hooks/useDashboard';
import { CardCarousel } from '../components/CardCarousel';
import { QuickActions } from '../components/QuickActions';
import { RecentMovements } from '../components/RecentMovements';

export const DashboardPage = () => {
    const {
        cards,
        payments,
        isLoading,
        mainCard,
        navigate,
        getCardNumberFormatted,
        ROUTES
    } = useDashboard();

    return (
        <div className="space-y-8">
            <CardCarousel
                cards={cards}
                isLoading={isLoading}
                onViewAll={() => navigate(ROUTES.CARDS)}
                onAddNew={() => navigate(ROUTES.CARDS)}
            />

            <QuickActions
                onPayCard={() => navigate(ROUTES.PAYMENTS)}
                onViewStatements={() => navigate(ROUTES.PAYMENTS)}
                isDisabled={!mainCard}
            />

            <RecentMovements
                payments={payments}
                onViewHistory={() => navigate(ROUTES.PAYMENTS)}
                getCardNumberFormatted={getCardNumberFormatted}
            />
        </div>
    );
};


