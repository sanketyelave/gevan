import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import Image from "next/image";
import { COLORS } from "@/constant/theme";

interface LoadingPageProps {
    onLoadingComplete: () => void;
}

const LoadingPage: React.FC<LoadingPageProps> = ({ onLoadingComplete }) => {
    const [opacity, setOpacity] = useState(0);
    const [progress, setProgress] = useState(0);
    const [logoScale, setLogoScale] = useState(0.9);
    const [titleOpacity, setTitleOpacity] = useState(0);

    useEffect(() => {
        setOpacity(1);
        setLogoScale(1);
        setTimeout(() => setTitleOpacity(1), 400);

        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        setOpacity(0);
                        setTimeout(() => onLoadingComplete(), 800);
                    }, 500);
                    return 100;
                }
                return prev + 20;
            });
        }, 500);

        return () => clearInterval(interval);
    }, [onLoadingComplete]);

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center px-4"
            style={{
                backgroundColor: COLORS.gray.light,
                opacity: opacity,
                transition: 'opacity 0.8s ease-in-out'
            }}
        >
            <div
                className="mb-6 relative"
                style={{
                    transform: `scale(${logoScale})`,
                    transition: 'transform 0.8s ease-out'
                }}
            >
                <div className="w-20 h-20 md:w-28 md:h-28 bg-white rounded-full flex items-center justify-center shadow-md">
                    <Image
                        src="/assets/logo.png"
                        alt="Logo"
                        className="w-20 h-20 md:w-28 md:h-28 rounded-full object-cover"
                        width={100}
                        height={100}
                    />
                </div>
            </div>

            <h1
                className="text-lg md:text-xl font-medium text-center"
                style={{
                    color: COLORS.black,
                    opacity: titleOpacity,
                    transform: `translateY(${titleOpacity ? '0' : '10px'})`,
                    transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
                }}
            >
                Empowering Farmers,
                <br />
                <span style={{ color: COLORS.primary }}>Revolutionizing Agriculture</span>
            </h1>

            <div className="flex flex-col items-center gap-3 mt-4">
                <Loader2 className="h-5 w-5 text-gray-500 animate-spin" />
                <div className="w-40 h-1 bg-gray-300 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-green-500 transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <span className="text-sm text-gray-600 font-medium">
                    Loading... {progress}%
                </span>
            </div>
        </div>
    );
};

export default LoadingPage;
