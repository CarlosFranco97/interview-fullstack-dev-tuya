import { VerifiedIcon } from '../../../components/common/Icons';

interface SecurityBadgeProps {
    className?: string;
}

export const SecurityBadge = ({ className = '' }: SecurityBadgeProps) => {
    return (
        <div className="flex items-center relative z-10 bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
            <div className={`flex items-center gap-4 ${className}`}>
                <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                    <VerifiedIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                    <p className="font-semibold text-white">Seguridad y confianza garantizada</p>
                    <p className="text-xs text-red-100">Tus datos siempre protegidos</p>
                </div>
            </div>
        </div>
    );
};
