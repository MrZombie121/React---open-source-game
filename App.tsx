
import React, { useState, useCallback, useEffect } from 'react';
import Game from './components/Game';
import GameUI from './components/GameUI';
import { GameState } from './types';
import { LEVELS } from './constants';

const App: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>(GameState.MENU);
    const [currentLevel, setCurrentLevel] = useState(0);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);

    const startGame = useCallback(() => {
        setScore(0);
        setLives(3);
        setCurrentLevel(0);
        setGameState(GameState.PLAYING);
    }, []);

    const restartGame = useCallback(() => {
        setScore(0);
        setLives(3);
        setCurrentLevel(0);
        setGameState(GameState.PLAYING);
    }, []);

    const handleQuitToMenu = useCallback(() => {
        setGameState(GameState.MENU);
    }, []);

    const nextLevel = useCallback(() => {
        if (currentLevel < LEVELS.length - 1) {
            setCurrentLevel(prevLevel => prevLevel + 1);
            setGameState(GameState.PLAYING);
        } else {
            setGameState(GameState.VICTORY);
        }
    }, [currentLevel]);
    
    const onLevelComplete = useCallback(() => {
        setTimeout(() => setGameState(GameState.LEVEL_COMPLETE), 500);
    }, []);

    const onGameOver = useCallback(() => {
        setGameState(GameState.GAME_OVER);
    }, []);
    
    const updateScore = useCallback((points: number) => {
        setScore(prev => prev + points);
    }, []);

    const loseLife = useCallback(() => {
        setLives(prev => prev - 1);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (gameState === GameState.PLAYING) {
                    setGameState(GameState.PAUSED);
                } else if (gameState === GameState.PAUSED) {
                    setGameState(GameState.PLAYING);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [gameState]);


    const renderContent = () => {
        switch (gameState) {
            case GameState.MENU:
                return (
                    <div className="flex flex-col items-center justify-center text-white h-full">
                        <h1 className="text-6xl font-bold mb-4 text-cyan-400" style={{fontFamily: "'Courier New', Courier, monospace"}}>React Platformer Quest</h1>
                        <p className="text-xl mb-8 text-gray-300">Collect coins, defeat enemies, and conquer 10 levels!</p>
                        <button onClick={startGame} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-2xl transition-transform transform hover:scale-105">
                            Start Game
                        </button>
                    </div>
                );
            case GameState.PLAYING:
            case GameState.PAUSED:
                return (
                    <>
                       <GameUI score={score} lives={lives} level={currentLevel + 1} />
                       <Game 
                           key={currentLevel}
                           isPaused={gameState === GameState.PAUSED}
                           levelData={LEVELS[currentLevel]}
                           onLevelComplete={onLevelComplete}
                           onGameOver={onGameOver}
                           updateScore={updateScore}
                           loseLife={loseLife}
                           lives={lives}
                        />
                         {gameState === GameState.PAUSED && (
                             <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-20">
                                <h2 className="text-6xl font-bold mb-8 text-white" style={{fontFamily: "'Courier New', Courier, monospace"}}>Paused</h2>
                                <button onClick={() => setGameState(GameState.PLAYING)} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-2xl mb-4 w-64 transition-transform transform hover:scale-105">
                                    Resume
                                </button>
                                <button onClick={handleQuitToMenu} className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-lg text-2xl w-64 transition-transform transform hover:scale-105">
                                    Quit to Menu
                                </button>
                            </div>
                        )}
                    </>
                );
            case GameState.LEVEL_COMPLETE:
                 return (
                    <div className="flex flex-col items-center justify-center text-white h-full">
                        <h2 className="text-5xl font-bold mb-4 text-yellow-400">Level {currentLevel + 1} Complete!</h2>
                        <p className="text-2xl mb-8">Score: {score}</p>
                        <button onClick={nextLevel} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-2xl transition-transform transform hover:scale-105">
                            Next Level
                        </button>
                    </div>
                );
            case GameState.GAME_OVER:
                return (
                    <div className="flex flex-col items-center justify-center text-white h-full">
                        <h2 className="text-6xl font-bold mb-4 text-red-500">Game Over</h2>
                        <p className="text-2xl mb-8">Final Score: {score}</p>
                        <button onClick={restartGame} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-lg text-2xl transition-transform transform hover:scale-105">
                            Try Again
                        </button>
                    </div>
                );
            case GameState.VICTORY:
                return (
                    <div className="flex flex-col items-center justify-center text-white h-full">
                        <h2 className="text-6xl font-bold mb-4 text-green-400">You Win!</h2>
                        <p className="text-3xl mb-2">Congratulations, you conquered the quest!</p>
                        <p className="text-2xl mb-8">Final Score: {score}</p>
                        <button onClick={startGame} className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-8 rounded-lg text-2xl transition-transform transform hover:scale-105">
                            Play Again
                        </button>
                    </div>
                );
        }
    };

    return (
        <main className="flex items-center justify-center h-screen bg-gray-900 select-none">
            <div className="w-[1024px] h-[768px] bg-black relative overflow-hidden border-4 border-gray-600 rounded-lg shadow-2xl shadow-cyan-500/20">
                {renderContent()}
            </div>
        </main>
    );
};

export default App;
