import React from 'react';

const AnimatedInput = React.forwardRef(({ label, error, className = '', ...props }, ref) => {
    return (
        <div className={`flex flex-col mb-4 ${className}`}>
            {label && <label className="label">{label}</label>}
            <input
                ref={ref}
                className={`input-field ${error ? 'border-red-400 focus:ring-red-400/30 focus:border-red-400' : ''}`}
                {...props}
            />
            {error && <span className="text-red-500 text-xs mt-1.5">{error}</span>}
        </div>
    );
});

export default AnimatedInput;
