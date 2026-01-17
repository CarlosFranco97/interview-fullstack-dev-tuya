import React from 'react';

interface DashboardButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon: React.ReactNode;
    label: string;
    description?: string;
    variant?: 'horizontal' | 'vertical';
    intent?: 'red' | 'blue' | 'gray';
}

const intentStyles = {
    red: {
        bg: 'bg-white',
        text: 'text-gray-900',
        border: 'border-gray-100',
        hover: 'hover:border-red-100 hover:shadow-md',
        iconBg: 'bg-red-100',
        iconText: 'text-red-600',
        iconHover: 'group-hover:bg-red-600 group-hover:text-white'
    },
    blue: {
        bg: 'bg-white',
        text: 'text-gray-900',
        border: 'border-gray-100',
        hover: 'hover:border-blue-100 hover:shadow-md',
        iconBg: 'bg-blue-50',
        iconText: 'text-blue-600',
        iconHover: 'group-hover:bg-blue-600 group-hover:text-white'
    },
    gray: {
        bg: 'bg-white',
        text: 'text-gray-500',
        border: 'border-gray-200 border-dashed border-2',
        hover: 'hover:border-red-300 hover:bg-red-50/30',
        iconBg: 'bg-gray-100',
        iconText: 'text-gray-600',
        iconHover: 'group-hover:bg-red-100'
    }
};


/**
 * A reusable action button for the dashboard.
 * Supports a horizontal layout (icon next to text) or vertical layout (icon above text).
 */
export const DashboardButton = ({
    icon,
    label,
    description,
    variant = 'horizontal',
    intent = 'gray',
    className = '',
    ...props
}: DashboardButtonProps) => {
    const isHorizontal = variant === 'horizontal';
    const styles = intentStyles[intent];

    const baseStyles = "transition-all group disabled:opacity-50 disabled:cursor-not-allowed";

    const horizontalStyles = `
        p-4 rounded-xl shadow-sm border
        ${styles.bg} ${styles.border} ${styles.hover}
        flex items-center gap-4
    `;

    const verticalStyles = `
        min-w-[100px] h-[200px] border-2 border-dashed rounded-2xl
        ${styles.bg} ${styles.border} ${styles.hover}
        flex flex-col items-center justify-center gap-2 snap-center
    `;

    return (
        <button
            className={`${baseStyles} ${isHorizontal ? horizontalStyles : verticalStyles} ${className}`}
            {...props}
        >
            <div className={`
                ${isHorizontal ? 'w-12 h-12' : 'w-10 h-10'} 
                rounded-full flex items-center justify-center transition-all duration-300
                ${styles.iconBg} ${styles.iconText} ${styles.iconHover}
            `}>
                {icon}
            </div>
            <div className={isHorizontal ? 'text-left' : ''}>
                <p className={`font-semibold transition-colors ${isHorizontal ? 'text-gray-900' : 'text-sm font-medium text-gray-500 group-hover:text-red-500'}`}>
                    {label}
                </p>
                {description && (
                    <p className="text-xs text-gray-500 mt-0.5">
                        {description}
                    </p>
                )}
            </div>
        </button>
    );
};
