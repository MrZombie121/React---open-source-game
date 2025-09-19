
import React from 'react';

interface GameUIProps {
    score: number;
    lives: number;
    level: number;
}

const HeartIcon: React.FC<{ className: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-1.383-.597 15.185 15.185 0 0 1-2.073-1.291c-1.4-1.107-2.668-2.618-3.6-4.215-1.442-2.4-2.14-5.06-2.14-7.844 0-3.77 3.067-6.837 6.837-6.837 1.94 0 3.702.804 4.998 2.112a6.834 6.834 0 0 1 5.02-2.112c3.77 0 6.837 3.067 6.837 6.837 0 2.783-.698 5.443-2.14 7.843-1.442 2.4-2.668 2.618-3.6 4.215a15.185 15.185 0 0 1-2.074 1.291 15.247 15.247 0 0 1-1.383.597l-.022.012-.007.004-.004.001a.752.752 0 0 1-.67 0l-.003-.001Z" />
    </svg>
);


const GameUI: React.FC<GameUIProps> = ({ score, lives, level }) => {
    return (
        <div className="absolute top-0 left-0 right-0 p-4 bg-black bg-opacity-30 text-white flex justify-between items-center z-10" style={{fontFamily: "'Courier New', Courier, monospace"}}>
            <div className="text-3xl font-bold">
                <span className="text-yellow-400">SCORE:</span>
                <span className="text-white ml-2">{score.toString().padStart(6, '0')}</span>
            </div>
            <div className="text-3xl font-bold">
                <span className="text-cyan-400">LEVEL:</span>
                <span className="text-white ml-2">{level}</span>
            </div>
            <div className="flex items-center">
                <span className="text-3xl font-bold text-red-500 mr-2">LIVES:</span>
                <div className="flex space-x-1">
                    {Array.from({ length: lives }).map((_, i) => (
                        <HeartIcon key={i} className="w-8 h-8 text-red-500" />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GameUI;
