import React from 'react';
import { Clock } from 'lucide-react';

interface LogoProps {
    className?: string;
    lightTheme?: boolean;
}

export default function NominaXLogo({ className = '', lightTheme = false }: LogoProps) {
    // The original logo has a navy blue color #0f2756
    const textColor = lightTheme ? 'text-white' : 'text-[#0f2756]';
    
    return (
        <div className={`flex items-center select-none ${className}`}>
            <div className={`flex items-center ${textColor}`} style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                <span className="text-4xl font-bold italic tracking-tight" style={{ marginRight: '-2px' }}>N</span>
                
                {/* The "o" replaced by a clock */}
                <div className="relative flex items-center justify-center -translate-y-[1px] mx-[1px]">
                    <Clock className="w-7 h-7 stroke-[3]" />
                    {/* The small accent mark above the O */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-1.5 h-2 bg-current rounded-full rotate-[15deg]"></div>
                </div>
                
                <span className="text-4xl font-bold italic tracking-tight" style={{ marginLeft: '-1px' }}>mina</span>
                <span className="text-4xl font-bold italic tracking-tight" style={{ marginLeft: '1px' }}>X</span>
            </div>
        </div>
    );
}
