import React from 'react';
import { Loader2 } from 'lucide-react';

const GradientButton = ({
    children,
    variant = 'primary',
    isLoading = false,
    className = '',
    disabled,
    icon: Icon,
    ...props
}) => {
    const baseClass =
        variant === 'primary' ? 'btn-primary'
            : variant === 'secondary' ? 'btn-secondary'
                : variant === 'danger' ? 'btn-danger'
                    : 'btn-ghost';

    return (
        <button
            className={`${baseClass} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : Icon ? (
                <Icon className="w-4 h-4" />
            ) : null}
            {children}
        </button>
    );
};

export default GradientButton;
