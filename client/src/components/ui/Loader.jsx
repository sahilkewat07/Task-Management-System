import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ fullScreen = false }) => {
    const content = (
        <div className="flex flex-col items-center justify-center space-y-4 animate-fade-in">
            <div className="relative">
                <div className="absolute inset-0 bg-primary-500/20 blur-xl rounded-full animate-pulse px-4 py-4" />
                <Loader2 className="w-10 h-10 text-primary-500 animate-spin relative z-10" />
            </div>
            <p className="text-zinc-400 font-medium tracking-wide">Loading...</p>
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
                {content}
            </div>
        );
    }

    return <div className="p-8 w-full flex justify-center">{content}</div>;
};

export default Loader;
