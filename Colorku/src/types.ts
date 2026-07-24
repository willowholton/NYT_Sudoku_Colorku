export interface Puzzle {
    given: number[][];
    solution: number[][];
}

export interface PuzzleData {
    day: string;
    date: string;
    displayDate: string;
    easy: Puzzle;
    medium: Puzzle;
    hard: Puzzle;
}

export type Page = 'landing' | 'easy' | 'medium' | 'hard';

export type Difficulty = 'easy' | 'medium' | 'hard';
