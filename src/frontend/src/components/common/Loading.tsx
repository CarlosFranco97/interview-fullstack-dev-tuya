interface LoadingProps {
    variant?: 'full' | 'inline';
    message?: string;
}

/**
 * Reusable loading spinner.
 * Supports 'full' (page center) and 'inline' (container center) variants.
 */
export const Loading = ({ variant = 'full', message = 'Cargando...' }: LoadingProps) => {
    const isFull = variant === 'full';

    return (
        <div className={`flex items-center justify-center ${isFull ? 'min-h-[400px] w-full' : 'py-8 w-full'}`}>
            <div className="flex flex-col items-center gap-3">
                <div className={`
                    ${isFull ? 'w-12 h-12 border-4' : 'w-8 h-8 border-2'} 
                    border-red-500 border-t-transparent rounded-full animate-spin
                `}></div>
                <p className="text-gray-500 text-sm font-medium">{message}</p>
            </div>
        </div>
    );
};

export default Loading;

