import React, { useEffect, useState } from 'react';
import { Button } from './Button';
import { CloseIcon } from './Icons';

export type ModalType = 'danger' | 'error' | 'warning' | 'info' | 'success';

interface SideModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    type?: ModalType;
    icon?: React.ReactNode;
    children?: React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => Promise<void> | void;
    isLoading?: boolean;
}

export const SideModal = ({
    isOpen,
    onClose,
    title,
    description,
    type = 'info',
    icon,
    children,
    confirmText = 'Aceptar',
    cancelText = 'Cancelar',
    onConfirm,
    isLoading = false
}: SideModalProps) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setMounted(true);
            document.body.style.overflow = 'hidden';
        } else {
            const timer = setTimeout(() => setMounted(false), 300);
            document.body.style.overflow = 'unset';
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!mounted && !isOpen) return null;

    const getConfirmButtonVariant = () => {
        if (type === 'danger' || type === 'error') return 'danger';
        return 'primary';
    };

    return (
        <div className="fixed inset-0 z-[100] overflow-hidden">
            <div
                className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            ></div>

            <div className="absolute inset-0 flex items-start justify-end p-4 sm:p-8 pointer-events-none">
                <div
                    className={`
                        w-full max-w-md bg-white shadow-2xl flex flex-col transition-all duration-300 ease-in-out pointer-events-auto
                        rounded-3xl max-h-[min(600px,90vh)] overflow-hidden
                        ${isOpen ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-12 opacity-0 scale-95'}
                    `}
                >
                    <div className="px-6 py-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                        <div className="flex items-center gap-3">
                            {icon}
                            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-50 rounded-full"
                            aria-label="Cerrar"
                        >
                            <CloseIcon className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto px-8 py-8">
                        {description && (
                            <p className="text-gray-600 mb-6 text-lg leading-relaxed font-medium">
                                {description}
                            </p>
                        )}
                        <div className="text-gray-500 leading-relaxed">
                            {children}
                        </div>
                    </div>

                    <div className="px-6 py-6 border-t border-gray-100 bg-gray-50 flex gap-3">
                        {onConfirm ? (
                            <>
                                <Button
                                    variant="secondary"
                                    className="flex-1 py-3"
                                    onClick={onClose}
                                    disabled={isLoading}
                                >
                                    {cancelText}
                                </Button>
                                <Button
                                    variant={getConfirmButtonVariant() as any}
                                    className="flex-1 py-3"
                                    onClick={onConfirm}
                                    isLoading={isLoading}
                                >
                                    {confirmText}
                                </Button>
                            </>
                        ) : (
                            <Button
                                variant="primary"
                                className="w-full py-3"
                                onClick={onClose}
                            >
                                Entendido
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
