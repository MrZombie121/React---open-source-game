import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Player, Enemy, Coin, Platform, LevelData, Vector2D, Boss } from '../types';
import { TILE_SIZE, GRAVITY, MAX_FALL_SPEED, PLAYER_SPEED, JUMP_STRENGTH, ENEMY_SPEED, ENEMY_AGGRO_RADIUS, BOSS_SPEED, BOSS_MAX_HEALTH, SOUND_DATA, LEVELS } from '../constants';

interface GameProps {
    levelData: LevelData;
    onLevelComplete: () => void;
    onGameOver: () => void;
    updateScore: (points: number) => void;
    loseLife: () => void;
    lives: number;
    isPaused: boolean;
}

const soundCache: { [key: string]: HTMLAudioElement } = {};
const playSound = (name: keyof typeof SOUND_DATA, volume = 0.3) => {
    try {
        if (!soundCache[name]) {
            soundCache[name] = new Audio(SOUND_DATA[name]);
            soundCache[name].volume = volume;
        }
        soundCache[name].currentTime = 0;
        soundCache[name].play().catch(() => {}); // Silently fail if autoplay is blocked
    } catch (e) {}
};


const Game: React.FC<GameProps> = ({ levelData, onLevelComplete, onGameOver, updateScore, loseLife, lives, isPaused }) => {
    const gameAreaRef = useRef<HTMLDivElement>(null);
    const [_, setFrame] = useState(0); // Used to force re-render

    const playerRef = useRef<Player | null>(null);
    const enemiesRef = useRef<Enemy[]>([]);
    const bossRef = useRef<Boss | null>(null);
    const coinsRef = useRef<Coin[]>([]);
    const platformsRef = useRef<Platform[]>([]);
    const totalCoins = useRef(0);
    
    const isFirstLevel = levelData === LEVELS[0];
    const [tutorialState, setTutorialState] = useState({
        move: isFirstLevel,
        jump: isFirstLevel,
        stomp: isFirstLevel,
    });


    const keysRef = useRef({ left: false, right: false, up: false });
    // FIX: Initialize useRef with an initial value of `undefined` to resolve the "Expected 1 arguments, but got 0" error.
    const animationFrameId = useRef<number | undefined>(undefined);
    const lastTimeRef = useRef<number>(performance.now());

    const initializeLevel = useCallback(() => {
        const newPlatforms: Platform[] = [];
        const newEnemies: Enemy[] = [];
        const newCoins: Coin[] = [];
        let newPlayer: Player | null = null;
        let newBoss: Boss | null = null;
        
        levelData.forEach((row, y) => {
            row.split('').forEach((char, x) => {
                const pos = { x: x * TILE_SIZE, y: y * TILE_SIZE };
                const id = `${x}-${y}`;
                if (char === 'P') {
                    newPlatforms.push({ id, pos, size: { x: TILE_SIZE, y: TILE_SIZE }, velocity: { x: 0, y: 0 } });
                } else if (char === 'S') {
                    newPlayer = { id: 'player', pos, size: { x: TILE_SIZE * 0.8, y: TILE_SIZE * 0.95 }, velocity: { x: 0, y: 0 }, isGrounded: false, isInvincible: false, invincibilityTimer: 0 };
                } else if (char === 'E') {
                    newEnemies.push({ id, pos, size: { x: TILE_SIZE, y: TILE_SIZE }, velocity: { x: 0, y: 0 }, type: 'goomba', direction: -1 });
                } else if (char === 'C') {
                    newCoins.push({ id, pos, size: { x: TILE_SIZE * 0.6, y: TILE_SIZE * 0.6 }, velocity: { x: 0, y: 0 } });
                } else if (char === 'B') {
                    newBoss = { id: 'boss', pos, size: { x: TILE_SIZE * 2, y: TILE_SIZE * 2 }, velocity: {x:0, y:0}, type: 'boss', direction: -1, health: BOSS_MAX_HEALTH, isInvincible: false, invincibilityTimer: 0 };
                }
            });
        });

        playerRef.current = newPlayer;
        enemiesRef.current = newEnemies;
        bossRef.current = newBoss;
        coinsRef.current = newCoins;
        platformsRef.current = newPlatforms;
        totalCoins.current = newCoins.length;

    }, [levelData]);
    
    useEffect(() => {
        initializeLevel();
    }, [initializeLevel]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft' || e.key === 'a') keysRef.current.left = true;
            if (e.key === 'ArrowRight' || e.key === 'd') keysRef.current.right = true;
            if (e.key === 'ArrowUp' || e.key === 'w' || e.key === ' ') keysRef.current.up = true;
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft' || e.key === 'a') keysRef.current.left = false;
            if (e.key === 'ArrowRight' || e.key === 'd') keysRef.current.right = false;
            if (e.key === 'ArrowUp' || e.key === 'w' || e.key === ' ') keysRef.current.up = false;
        };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    const isColliding = (a: {pos: Vector2D, size: Vector2D}, b: {pos: Vector2D, size: Vector2D}) => {
        return (
            a.pos.x < b.pos.x + b.size.x &&
            a.pos.x + a.size.x > b.pos.x &&
            a.pos.y < b.pos.y + b.size.y &&
            a.pos.y + a.size.y > b.pos.y
        );
    };

    const handlePlayerDamage = useCallback((isFall: boolean = false) => {
        const player = playerRef.current;
        if (!player) return;

        player.isInvincible = true;
        player.invincibilityTimer = 120; // 2 seconds of invincibility
        
        playSound('hurt');
        loseLife();

        if (lives - 1 <= 0) {
            playSound('gameOver', 0.5);
            onGameOver();
        } else if (!isFall) {
            // vertical bounce knockback
            player.velocity.y = JUMP_STRENGTH / 2;
        } else {
             // Reset from fall
             initializeLevel();
        }
    }, [initializeLevel, lives, loseLife, onGameOver]);

    const gameLoop = useCallback((currentTime: number) => {
        animationFrameId.current = requestAnimationFrame(gameLoop);
        const deltaTime = (currentTime - lastTimeRef.current) / 16.67; // Normalize to 60 FPS
        lastTimeRef.current = currentTime;
        
        const player = playerRef.current;
        if (!player) return;

        // --- UPDATE PLAYER ---
        player.velocity.x = 0;
        if (keysRef.current.left) {
            player.velocity.x = -PLAYER_SPEED;
            if (tutorialState.move) setTutorialState(prev => ({...prev, move: false}));
        }
        if (keysRef.current.right) {
            player.velocity.x = PLAYER_SPEED;
            if (tutorialState.move) setTutorialState(prev => ({...prev, move: false}));
        }
        if (keysRef.current.up && player.isGrounded) {
            player.velocity.y = JUMP_STRENGTH;
            player.isGrounded = false;
            playSound('jump');
            if (tutorialState.jump) setTutorialState(prev => ({...prev, jump: false}));
        }

        player.velocity.y += GRAVITY * deltaTime;
        if (player.velocity.y > MAX_FALL_SPEED) player.velocity.y = MAX_FALL_SPEED;
        
        player.pos.x += player.velocity.x * deltaTime;
        handleCollisions('horizontal', player, platformsRef.current);
        
        player.pos.y += player.velocity.y * deltaTime;
        player.isGrounded = false;
        handleCollisions('vertical', player, platformsRef.current);

        if (player.isInvincible) {
            player.invincibilityTimer -= deltaTime;
            if (player.invincibilityTimer <= 0) {
                player.isInvincible = false;
            }
        }

        // --- UPDATE ENEMIES ---
        enemiesRef.current.forEach(enemy => {
            const distanceX = player.pos.x - enemy.pos.x;
            // Basic aggro logic: attack if player is within range and roughly on the same level
            if (Math.abs(distanceX) < ENEMY_AGGRO_RADIUS && Math.abs(player.pos.y - enemy.pos.y) < TILE_SIZE * 2) {
                enemy.direction = Math.sign(distanceX) as -1 | 1;
            }

            enemy.velocity.x = ENEMY_SPEED * enemy.direction;
            enemy.velocity.y += GRAVITY * deltaTime;
            
            enemy.pos.x += enemy.velocity.x * deltaTime;
            handleCollisions('horizontal', enemy, platformsRef.current, () => enemy.direction *= -1);

            enemy.pos.y += enemy.velocity.y * deltaTime;
            handleCollisions('vertical', enemy, platformsRef.current);
        });

        // --- UPDATE BOSS ---
        const boss = bossRef.current;
        if (boss) {
            const playerCenter = player.pos.x + player.size.x / 2;
            const bossCenter = boss.pos.x + boss.size.x / 2;
            boss.direction = playerCenter < bossCenter ? -1 : 1;

            boss.velocity.x = BOSS_SPEED * boss.direction;
            boss.velocity.y += GRAVITY * deltaTime;

            boss.pos.x += boss.velocity.x * deltaTime;
            handleCollisions('horizontal', boss, platformsRef.current);

            boss.pos.y += boss.velocity.y * deltaTime;
            handleCollisions('vertical', boss, platformsRef.current);

            if (boss.isInvincible) {
                boss.invincibilityTimer -= deltaTime;
                if (boss.invincibilityTimer <= 0) {
                    boss.isInvincible = false;
                }
            }
        }


        // --- CHECK GAMEPLAY COLLISIONS ---
        // Player vs Coins
        coinsRef.current = coinsRef.current.filter(coin => {
            if (isColliding(player, coin)) {
                playSound('coin', 0.5);
                updateScore(100);
                return false;
            }
            return true;
        });

        // Player vs Enemies
        enemiesRef.current = enemiesRef.current.filter(enemy => {
            if (isColliding(player, enemy)) {
                // Stomp check
                if (player.velocity.y > 0 && player.pos.y + player.size.y < enemy.pos.y + enemy.size.y / 2) {
                    playSound('stomp');
                    updateScore(200);
                    player.velocity.y = JUMP_STRENGTH / 1.5; // bounce
                    if (tutorialState.stomp) setTutorialState(prev => ({...prev, stomp: false}));
                    return false; // Enemy defeated
                } else if (!player.isInvincible) {
                    handlePlayerDamage();
                }
            }
            return true;
        });

        // Player vs Boss
        if (boss && isColliding(player, boss)) {
             if (player.velocity.y > 0 && player.pos.y + player.size.y < boss.pos.y + boss.size.y / 2 && !boss.isInvincible) {
                 boss.health--;
                 boss.isInvincible = true;
                 boss.invincibilityTimer = 60; // 1 second
                 playSound('stomp');
                 updateScore(500);
                 player.velocity.y = JUMP_STRENGTH; // big bounce
                 if (boss.health <= 0) {
                     updateScore(5000);
                     bossRef.current = null;
                 }
             } else if (!player.isInvincible) {
                handlePlayerDamage();
             }
        }

        // --- CHECK WIN/LOSS CONDITIONS ---
        if (player.pos.y > TILE_SIZE * 16) { // Fell off screen
             handlePlayerDamage(true);
        }

        if (coinsRef.current.length === 0 && !bossRef.current) {
            playSound('levelComplete', 0.5);
            onLevelComplete();
            return;
        }

        setFrame(f => f + 1);
    }, [handlePlayerDamage, onLevelComplete, updateScore, tutorialState.move, tutorialState.jump, tutorialState.stomp]);
    
    const handleCollisions = (axis: 'horizontal' | 'vertical', entity: Player | Enemy | Boss, platforms: Platform[], onCollideX?: () => void) => {
        for (const platform of platforms) {
            if (isColliding(entity, platform)) {
                if (axis === 'vertical') {
                    if (entity.velocity.y > 0) {
                        entity.pos.y = platform.pos.y - entity.size.y;
                        entity.velocity.y = 0;
                        if ('isGrounded' in entity) {
                            (entity as Player).isGrounded = true;
                        }
                    } else if (entity.velocity.y < 0) {
                        entity.pos.y = platform.pos.y + platform.size.y;
                        entity.velocity.y = 0;
                    }
                }
                if (axis === 'horizontal') {
                    if (entity.velocity.x > 0) {
                        entity.pos.x = platform.pos.x - entity.size.x;
                    } else if (entity.velocity.x < 0) {
                        entity.pos.x = platform.pos.x + platform.size.x;
                    }
                    if (onCollideX) onCollideX();
                }
            }
        }
    };
    
    useEffect(() => {
        if (isPaused) {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
                animationFrameId.current = undefined;
            }
            return;
        }

        lastTimeRef.current = performance.now();
        animationFrameId.current = requestAnimationFrame(gameLoop);
        
        return () => {
            if(animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
                animationFrameId.current = undefined;
            }
        };
    }, [isPaused, gameLoop]);

    const renderGameObject = (obj: {id: string, pos: Vector2D, size: Vector2D}, className: string) => (
         <div key={obj.id} className={`absolute ${className}`} style={{ left: obj.pos.x, top: obj.pos.y, width: obj.size.x, height: obj.size.y }} />
    );
    
    const TutorialMessage: React.FC<{style: React.CSSProperties, children: React.ReactNode}> = ({ style, children }) => (
        <div className="absolute text-white text-xl font-bold p-2 rounded bg-black bg-opacity-60 shadow-lg animate-pulse" style={style}>
            {children}
        </div>
    );


    const player = playerRef.current;
    const boss = bossRef.current;
    const firstEnemy = enemiesRef.current.find(e => e.pos.x < TILE_SIZE * 10);

    return (
        <div ref={gameAreaRef} className="w-full h-full bg-gray-800 relative overflow-hidden" style={{ background: 'linear-gradient(to bottom, #4a7d9f, #81c0e5)'}}>
            {platformsRef.current.map(p => renderGameObject(p, 'bg-green-700 border-b-8 border-green-900'))}
            {coinsRef.current.map(c => <div key={c.id} className="absolute bg-yellow-400 rounded-full border-2 border-yellow-600 animate-bounce" style={{ left: c.pos.x + c.size.x/2, top: c.pos.y + c.size.y/2, width: c.size.x, height: c.size.y }} /> )}
            {enemiesRef.current.map(e => renderGameObject(e, 'bg-red-800 rounded-t-full border-b-4 border-red-900'))}
            {boss && (
                <div className={`absolute transition-opacity duration-200 ${boss.isInvincible ? 'opacity-50' : 'opacity-100'}`} style={{ left: boss.pos.x, top: boss.pos.y, width: boss.size.x, height: boss.size.y }}>
                    <div className="w-full h-full bg-purple-800 rounded-lg border-b-8 border-purple-950 relative">
                        <div className="absolute -top-6 left-0 right-0 mx-auto w-3/4 h-3 bg-gray-500 rounded-full overflow-hidden border-2 border-black">
                            <div className="h-full bg-red-500" style={{width: `${(boss.health / BOSS_MAX_HEALTH) * 100}%`}}></div>
                        </div>
                    </div>
                </div>
            )}
            {player && (
                 <div className={`absolute transition-opacity duration-200 ${player.isInvincible ? 'opacity-50 animate-pulse' : 'opacity-100'}`} style={{ left: player.pos.x, top: player.pos.y, width: player.size.x, height: player.size.y }}>
                    <div className="w-full h-full bg-blue-500 rounded-t-lg border-b-4 border-blue-700" />
                 </div>
            )}
            
            {/* Tutorial UI */}
            {tutorialState.move && player && (
                <TutorialMessage style={{ left: player.pos.x - 100, top: player.pos.y - 70 }}>
                    Use A/D or ←/→ to Move
                </TutorialMessage>
            )}
            {!tutorialState.move && tutorialState.jump && player && (
                <TutorialMessage style={{ left: player.pos.x - 150, top: player.pos.y - 70 }}>
                    Press W, ↑, or Space to Jump!
                </TutorialMessage>
            )}
            {!tutorialState.jump && tutorialState.stomp && firstEnemy && (
                 <TutorialMessage style={{ left: firstEnemy.pos.x - 40, top: firstEnemy.pos.y - 70 }}>
                     Jump on enemies to defeat them!
                    <div className="absolute left-1/2 -bottom-2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-black opacity-60" style={{transform: 'translateX(-50%)'}} />
                </TutorialMessage>
            )}
        </div>
    );
};

export default Game;