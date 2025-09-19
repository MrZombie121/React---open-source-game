import { LevelData } from './types';

export const TILE_SIZE = 48;

// Physics
export const GRAVITY = 0.8;
export const MAX_FALL_SPEED = 15;
export const PLAYER_SPEED = 5;
export const JUMP_STRENGTH = -18;
export const ENEMY_SPEED = 1;
export const ENEMY_AGGRO_RADIUS = TILE_SIZE * 8;
export const BOSS_SPEED = 2;
export const BOSS_MAX_HEALTH = 5;

// Base64 encoded sound data
export const SOUND_DATA = {
    jump: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=',
    coin: 'data:audio/wav;base64,UklGRlIAAABXQVZFZm10IBAAAAABAAIARKwAABCxAgAEABAAZGF0YSJIAAAD6PT/AP/7/v8A/AD3/Db3/CT5/gD7/QD8+/+BAsQGZgr0D/IP3hHwFCgWbheGGKkZ5BrAGywdGB4eH8cg2iMlJkQnUCtCLbAv/jOANb83pTq/PWc/DkF2QpNES0V+RslK0U4pUOFVp1hnXJNexmBfYdZlQGduaJprvHBcc293kHqkfMh/oYEMhliIvZFYlneYq5w/ni+haqPRp8+quKzAr/2xwLPRtcm50bvovAneDeEL8wz2D/0cASgCKwNRA18EdgYvB/0JlgtTDH4N1Q7rD/4R1hRkFloXRRhKGS8apRszHF8d2h+QIJEi/SQXJxwpDSsULFcvJjRMNyY6wD0sP4tCj0VyR8ZMP1JRVWJXfF95Yv1mWGo8bKZxWnZke4p/kYSRi5eSl5yfoqOkpqyusLK3ub7BwsfKy8/T1tjZ3N/h5OXo6/Du8vT2+Pr7/P/9',
    stomp: 'data:audio/wav;base64,UklGRjwAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YRYAAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA',
    hurt: 'data:audio/wav;base64,UklGRlAAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YVIAAAAAaPz/b/3/fP//ev7/ff//h//9i///j///mv//o///q///s///u///wv//y///0P//2v//4f//6///8f//9///+///AAMABwALAA8AEwAXABsAHwAjACcAKwAvADMANwA7AD8AQwBHAEsATwBTAVcBWwBfAWMAbwB/AIsAjwCTAJcAmwCnAKsAtQC7AMMAxwC/AMsA0wDbAN8A4wDrAPMA9wD7AP8A',
    levelComplete: 'data:audio/wav;base64,UklGRmAAAABXQVZFZm10IBAAAAABAAIARKwAABCxAgAEABAAZGF0YVAAAABIAxQEKwT/BPkFrAcNCi8L2A0IDhMP3hDBEiIUcBP+FYEXjBhtGe0bHRwSHXgfASMhI/8kViYAKEYq9i0ILvowNTYGO+I/E0IqREpG40g8SoNNG1Q5VjRbiF+QY6BmgGtVcF54RHy2gSKFq4penKOfqKWqqLCuu8PAysvO1Nba3uHk6Ovu8vX3/v8A/v8A/v8A/v8A/v8A/v8A/v8A',
    gameOver: 'data:audio/wav;base64,UklGRoAAAABXQVZFZm10IBAAAAABAAIARKwAABCxAgAEABAAZGF0YVAAAACA/v8U/f8Z/f8A/f8E/v8J/v8S/v8Z/v8i/v8q/v8z/v89/v9E/v9P/v9a/v9m/v9w/v97/v+D/v+O/v+Z/v+j/v+r/v+z/v+8/v/E/v/O/v/X//8=',
};


// ' ' = empty, 'P' = platform, 'C' = coin, 'E' = enemy, 'S' = start, 'B' = boss
export const LEVELS: LevelData[] = [
  // Level 1
  [
    "                    ",
    "                    ",
    "                    ",
    "                    ",
    "                    ",
    "                    ",
    "                    ",
    "     C   C   C      ",
    "    PPP PPPP PPP    ",
    "                    ",
    "  E               E ",
    " PPPP   S    PPPPPP ",
    "      E    E        ",
    "PPPPPPPPPPPPPPPPPPPP",
    "PPPPPPPPPPPPPPPPPPPP",
    "PPPPPPPPPPPPPPPPPPPP",
  ],
  // Level 2
  [
    "                    ",
    "                    ",
    "          C         ",
    "         PPP        ",
    "                    ",
    "      C       C     ",
    "     PPP     PPP    ",
    "   C                ",
    "  PPP   E           ",
    " S         PPPPPP   ",
    " P      E           ",
    " P   PPPPPPPP       ",
    " P         E        ",
    " PPPPPPPPPPPPPPPPPP ",
    "PPPPPPPPPPPPPPPPPPPP",
    "PPPPPPPPPPPPPPPPPPPP",
  ],
  // Level 3
  [
    "                    ",
    "               C    ",
    "              PPP   ",
    "             E      ",
    "            PPPP    ",
    "       C            ",
    "      PPP           ",
    "     E              ",
    "    PPPP     C      ",
    "   S        PPP     ",
    "  P    C   E        ",
    " PPP  PPP PPPPPPPPP ",
    "   P E P            ",
    " PPPPPPPPPPPPP PPPP ",
    "PPPPPPPPPPPPPPPPPPPP",
    "PPPPPPPPPPPPPPPPPPPP",
  ],
  // Level 4
  [
    "                    ",
    "                    ",
    "                    ",
    "   P C P C P C P    ",
    "                    ",
    "                    ",
    "                    ",
    "  E      E      E   ",
    " PPPP   PPPP   PPPP ",
    "                    ",
    " S                  ",
    " P        E         ",
    " PPPPP PPPP PPPPP   ",
    "                    ",
    "PPPPPPPPPPPPPPPPPPPP",
    "PPPPPPPPPPPPPPPPPPPP",
  ],
  // Level 5
  [
    "                    ",
    " C P  C P  C P  C P ",
    "                    ",
    " P  C P  C P  C P  C",
    "                    ",
    "                    ",
    "                    ",
    "      P   P   P     ",
    "     E         E    ",
    "    PPPP     PPPP   ",
    "                    ",
    "S P                 ",
    " PPP                ",
    "    E      E      E ",
    "PPPPPPPPPPPPPPPPPPPP",
    "PPPPPPPPPPPPPPPPPPPP",
  ],
  // Level 6
  [
    "                    ",
    "                    ",
    "                    ",
    "   C                ",
    "  PPP         C     ",
    "    P        PPP    ",
    "   E P              ",
    "  PPPP P      C     ",
    "         P   PPP    ",
    " S         P        ",
    " P      E  P        ",
    " PPPP  PPPP P       ",
    "      P      P      ",
    "     E P    E P     ",
    "PPPPPPPPPPPPPPPPPPPP",
    "PPPPPPPPPPPPPPPPPPPP",
  ],
  // Level 7
  [
    "      C    C    C   ",
    "     PPP  PPP  PPP  ",
    "                    ",
    "                    ",
    "                    ",
    "P P P P P P P P P P ",
    " P P P P P P P P P P",
    "P P P P P P P P P P ",
    " E   E   E   E   E  ",
    "PPPPPPPPPPPPPPPPPPPP",
    "                    ",
    "S                   ",
    "P                   ",
    "PPPPPPPPPPPPPPPPPPPP",
    "PPPPPPPPPPPPPPPPPPPP",
    "PPPPPPPPPPPPPPPPPPPP",
  ],
  // Level 8
  [
    "PPPPPPPPPPPPPPPPPPPP",
    "P C                P",
    "P P PPPPPP PPPPPP  P",
    "P P P E P  P E  P  P",
    "P   P   P  P    P  P",
    "P P PPP P  PPPPPP  P",
    "P P                P",
    "P PPP  C  C  C PPP P",
    "P   P PPPPPP PPP   P",
    "P P P      E P P   P",
    "P P P PPPPPP P P C P",
    "P S P        P PPPP",
    "P   PPPPPPPPPP     P",
    "P                  P",
    "PPPPPPPPPPPPPPPPPPPP",
    "PPPPPPPPPPPPPPPPPPPP",
  ],
  // Level 9
  [
    "                    ",
    "                    ",
    "                    ",
    "                    ",
    "  P    P    P    P   ",
    "  C    C    C    C   ",
    " PPEEPPPEEPPPEEPPPEE",
    "PPPPPPPPPPPPPPPPPPPP",
    "                    ",
    "                    ",
    "S                   ",
    "P                   ",
    "P         E         ",
    "PPPPPPPPPPPPPPPPPPPP",
    "PPPPPPPPPPPPPPPPPPPP",
    "PPPPPPPPPPPPPPPPPPPP",
  ],
  // Level 10 - Boss Level
  [
    "                    ",
    "                    ",
    "                    ",
    "                    ",
    "      C     C       ",
    "     PPP   PPP      ",
    "                    ",
    "                    ",
    "                    ",
    "S            B      ",
    "P                   ",
    "PP                  ",
    "PPP                 ",
    "PPPPPPPPPPPPPPPPPPPP",
    "PPPPPPPPPPPPPPPPPPPP",
    "PPPPPPPPPPPPPPPPPPPP",
  ]
];