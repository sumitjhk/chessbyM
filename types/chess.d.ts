/**
 * CHESS TYPES
 * This file defines all TypeScript types used throughout the chess app
 */

// Piece types in chess
export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k'; // pawn, knight, bishop, rook, queen, king
export type PieceColor = 'w' | 'b'; // white or black

// Chess piece object
export interface ChessPiece {
  type: PieceType;
  color: PieceColor;
}

// Position on the board (0-7 for both row and col)
export interface Position {
  row: number;
  col: number;
}

// A chess move with all details
export interface ChessMove {
  from: string;        // e.g., 'e2'
  to: string;          // e.g., 'e4'
  piece: ChessPiece;
  captured?: ChessPiece;
  promotion?: PieceType;
  flags: string;       // Special move flags (castling, en passant, etc.)
  san: string;         // Standard Algebraic Notation (e.g., 'Nf3')
}

// Game modes
export type GameMode = 'local' | 'ai' | 'online' | 'puzzle';

// AI difficulty levels
export type AIDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

// Game status
export type GameStatus = 
  | 'playing' 
  | 'check' 
  | 'checkmate' 
  | 'stalemate' 
  | 'draw' 
  | 'resigned';

// Complete game state
export interface GameState {
  fen: string;              // Board position in FEN notation
  turn: PieceColor;         // Whose turn it is
  moveHistory: ChessMove[]; // All moves made
  status: GameStatus;
  timer?: {
    white: number;          // Seconds remaining
    black: number;
  };
}

// Puzzle data
export interface ChessPuzzle {
  id: string;
  fen: string;              // Starting position
  moves: string[];          // Solution moves
  rating: number;           // Difficulty rating
  themes: string[];         // e.g., ['fork', 'pin', 'mate in 2']
}

// Network message for P2P
export interface NetworkMessage {
  type: 'move' | 'game_start' | 'game_end' | 'chat';
  data: any;
  timestamp: number;
}
