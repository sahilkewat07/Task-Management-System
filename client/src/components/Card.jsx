import React from 'react';

/**
 * Base Card component for consistent design system compliance.
 * Supports glassmorphism, different padding, and custom classes.
 */
const Card = ({
    children,
    className = "",
    padding = "p-10",
    animated = true,
    delay = "0s",
    onClick
}) => {
    const baseClasses = "bg-white dark:bg-slate-900 border-none rounded-[2.5rem] shadow-sm";
    const animationClasses = animated ? "animate-slide-up" : "";

    return (
        <div
            className={`${baseClasses} ${padding} ${animationClasses} ${className}`}
            style={animated ? { animationDelay: delay } : {}}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

export default Card;
