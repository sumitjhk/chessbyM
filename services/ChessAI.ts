/**
 * CHESS AI SERVICE
 * Uses minimax with enhanced evaluation for multiple difficulty levels
 * up to Grandmaster strength
 */

import { Chess } from 'chess.js';

// Piece square tables for positional evaluation
const PAWN_TABLE = [
   0,  0,  0,  0,  0,  0,  0,  0,
  50, 50, 50, 50, 50, 50, 50, 50,
  10, 10, 20, 30, 30, 20, 10, 10,
   5,  5, 10, 25, 25, 10,  5,  5,
   0,  0,  0, 20, 20,  0,  0,  0,
   5, -5,-10,  0,  0,-10, -5,  5,
   5, 10, 10,-20,-20, 10, 10,  5,
   0,  0,  0,  0,  0,  0,  0,  0,
];

const KNIGHT_TABLE = [
  -50,-40,-30,-30,-30,-30,-40,-50,
  -40,-20,  0,  0,  0,  0,-20,-40,
  -30,  0, 10, 15, 15, 10,  0,-30,
  -30,  5, 15, 20, 20, 15,  5,-30,
  -30,  0, 15, 20, 20, 15,  0,-30,
  -30,  5, 10, 15, 15, 10,  5,-30,
  -40,-20,  0,  5,  5,  0,-20,-40,
  -50,-40,-30,-30,-30,-30,-40,-50,
];

const BISHOP_TABLE = [
  -20,-10,-10,-10,-10,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5, 10, 10,  5,  0,-10,
  -10,  5,  5, 10, 10,  5,  5,-10,
  -10,  0, 10, 10, 10, 10,  0,-10,
  -10, 10, 10, 10, 10, 10, 10,-10,
  -10,  5,  0,  0,  0,  0,  5,-10,
  -20,-10,-10,-10,-10,-10,-10,-20,
];

const ROOK_TABLE = [
   0,  0,  0,  0,  0,  0,  0,  0,
   5, 10, 10, 10, 10, 10, 10,  5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
   0,  0,  0,  5,  5,  0,  0,  0,
];

const QUEEN_TABLE = [
  -20,-10,-10, -5, -5,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5,  5,  5,  5,  0,-10,
   -5,  0,  5,  5,  5,  5,  0, -5,
    0,  0,  5,  5,  5,  5,  0, -5,
  -10,  5,  5,  5,  5,  5,  0,-10,
  -10,  0,  5,  0,  0,  0,  0,-10,
  -20,-10,-10, -5, -5,-10,-10,-20,
];

const KING_MIDDLE_TABLE = [
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -20,-30,-30,-40,-40,-30,-30,-20,
  -10,-20,-20,-20,-20,-20,-20,-10,
   20, 20,  0,  0,  0,  0, 20, 20,
   20, 30, 10,  0,  0, 10, 30, 20,
];

const PIECE_VALUES: Record<string, number> = {
  p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000,
};

class ChessAI {
  private depth: number = 4;
  private useRandom: number = 0; // randomness factor for lower difficulties

  setDifficulty(difficulty: 'beginner' | 'easy' | 'medium' | 'hard' | 'expert' | 'master' | 'grandmaster') {
    switch (difficulty) {
      case 'beginner':
        this.depth = 1;
        this.useRandom = 0.8; // 80% random moves
        break;
      case 'easy':
        this.depth = 2;
        this.useRandom = 0.4;
        break;
      case 'medium':
        this.depth = 3;
        this.useRandom = 0.1;
        break;
      case 'hard':
        this.depth = 4;
        this.useRandom = 0.05;
        break;
      case 'expert':
        this.depth = 5;
        this.useRandom = 0;
        break;
      case 'master':
        this.depth = 6;
        this.useRandom = 0;
        break;
      case 'grandmaster':
        this.depth = 7;
        this.useRandom = 0;
        break;
    }
  }

  private getPieceSquareValue(type: string, color: string, row: number, col: number): number {
    const index = color === 'w' ? (7 - row) * 8 + col : row * 8 + col;
    switch (type) {
      case 'p': return PAWN_TABLE[index];
      case 'n': return KNIGHT_TABLE[index];
      case 'b': return BISHOP_TABLE[index];
      case 'r': return ROOK_TABLE[index];
      case 'q': return QUEEN_TABLE[index];
      case 'k': return KING_MIDDLE_TABLE[index];
      default: return 0;
    }
  }

  private evaluatePosition(chess: Chess): number {
    if (chess.isCheckmate()) return chess.turn() === 'w' ? -99999 : 99999;
    if (chess.isDraw() || chess.isStalemate()) return 0;

    let score = 0;
    const board = chess.board();

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (!piece) continue;
        const value = PIECE_VALUES[piece.type] + this.getPieceSquareValue(piece.type, piece.color, r, c);
        score += piece.color === 'w' ? value : -value;
      }
    }

    // Mobility bonus
    const mobilityBonus = chess.moves().length * 0.1;
    score += chess.turn() === 'w' ? mobilityBonus : -mobilityBonus;

    return score;
  }

  private minimax(chess: Chess, depth: number, alpha: number, beta: number, isMaximizing: boolean): number {
    if (depth === 0 || chess.isGameOver()) {
      return this.evaluatePosition(chess);
    }

    const moves = chess.moves({ verbose: true });

    // Move ordering: captures first for better pruning
    moves.sort((a: any, b: any) => {
      const aCapture = a.captured ? PIECE_VALUES[a.captured] : 0;
      const bCapture = b.captured ? PIECE_VALUES[b.captured] : 0;
      return bCapture - aCapture;
    });

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const move of moves) {
        chess.move(move);
        const evaluation = this.minimax(chess, depth - 1, alpha, beta, false);
        chess.undo();
        maxEval = Math.max(maxEval, evaluation);
        alpha = Math.max(alpha, evaluation);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const move of moves) {
        chess.move(move);
        const evaluation = this.minimax(chess, depth - 1, alpha, beta, true);
        chess.undo();
        minEval = Math.min(minEval, evaluation);
        beta = Math.min(beta, evaluation);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  }

  async getBestMoveAdvanced(fen: string): Promise<string | null> {
    const chess = new Chess(fen);
    const moves = chess.moves({ verbose: true });
    if (moves.length === 0) return null;

    // Add randomness for lower difficulties
    if (this.useRandom > 0 && Math.random() < this.useRandom) {
      const randomMove = moves[Math.floor(Math.random() * moves.length)];
      return `${randomMove.from}${randomMove.to}${(randomMove as any).promotion || ''}`;
    }

    const isMaximizing = chess.turn() === 'w';
    let bestMove = moves[0];
    let bestValue = isMaximizing ? -Infinity : Infinity;

    // Move ordering
    moves.sort((a: any, b: any) => {
      const aCapture = a.captured ? PIECE_VALUES[a.captured] : 0;
      const bCapture = b.captured ? PIECE_VALUES[b.captured] : 0;
      return bCapture - aCapture;
    });

    for (const move of moves) {
      chess.move(move);
      const value = this.minimax(chess, this.depth - 1, -Infinity, Infinity, !isMaximizing);
      chess.undo();

      if (isMaximizing ? value > bestValue : value < bestValue) {
        bestValue = value;
        bestMove = move;
      }
    }

    return `${bestMove.from}${bestMove.to}${(bestMove as any).promotion || ''}`;
  }
}

export const chessAI = new ChessAI();