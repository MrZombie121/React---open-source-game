
export interface Vector2D {
    x: number;
    y: number;
}

export interface GameObject {
    id: string;
    pos: Vector2D;
    size: Vector2D;
    velocity: Vector2D;
}

export interface Player extends GameObject {
    isGrounded: boolean;
    isInvincible: boolean;
    invincibilityTimer: number;
}

export interface Enemy extends GameObject {
    type: 'goomba';
    direction: -1 | 1;
}

export interface Boss extends GameObject {
    type: 'boss';
    direction: -1 | 1;
    health: number;
    isInvincible: boolean;
    invincibilityTimer: number;
}

export interface Coin extends GameObject {}

export interface Platform extends GameObject {}

export type LevelData = string[];

export enum GameState {
    MENU,
    PLAYING,
    PAUSED,
    LEVEL_COMPLETE,
    GAME_OVER,
    VICTORY,
}
