import React from 'react';

const GlassCard = ({ children, className = '', ...props }) => {
    return (
        <div className={`card ${className}`} {...props}>
            {children}
        </div>
    );
};

export default GlassCard;
