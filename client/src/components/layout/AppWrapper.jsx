import React, { useEffect, useState } from 'react';

const AppWrapper = ({ children }) => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;
            setMousePos({ x, y });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="min-h-screen relative overflow-hidden bg-background text-zinc-100 font-sans">
            {/* Dynamic Interactive Glow */}
            <div
                className="pointer-events-none fixed inset-0 z-0 transition-all duration-300 ease-out opacity-40 mix-blend-screen"
                style={{
                    background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(99, 102, 241, 0.15) 0%, rgba(6, 182, 212, 0.05) 50%, transparent 80%)`
                }}
            />

            {/* Ambient Static Glows */}
            <div className="bg-glow-container z-0">
                <div className="bg-glow-primary opacity-50"></div>
                <div className="bg-glow-accent opacity-50"></div>
                <div className="bg-glow-danger opacity-30"></div>
            </div>

            {/* Content Area */}
            <div className="relative z-10 w-full h-full min-h-screen flex flex-col">
                {children}
            </div>
        </div>
    );
};

export default AppWrapper;
