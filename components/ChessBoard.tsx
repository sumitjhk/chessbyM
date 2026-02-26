/**
 * CHESS BOARD COMPONENT
 * Reusable board for Local, AI, and Online modes
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Chess } from 'chess.js';
import ChessSquare from './ChessSquare';
import { SQUARE_SIZE, BOARD_SIZE } from './chessBoardConstants';

const COLUMNS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const ROWS = ['8', '7', '6', '5', '4', '3', '2', '1'];

interface Props {
  game: Chess;
  selectedSquare: string | null;
  validMoves: string[];
  flipped: boolean;
  onSquarePress: (squareId: string) => void;
}

export default function ChessBoard({ game, selectedSquare, validMoves, flipped, onSquarePress }: Props) {
  const rows = flipped ? [...ROWS].reverse() : ROWS;
  const cols = flipped ? [...COLUMNS].reverse() : COLUMNS;

  const getCheckSquare = () => {
    if (!game.isCheck()) return null;
    const board = game.board();
    const turn = game.turn();
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = board[r][c];
        if (p && p.type === 'k' && p.color === turn) {
          return `${COLUMNS[c]}${8 - r}`;
        }
      }
    }
    return null;
  };

  const checkSquare = getCheckSquare();

  return (
    <View style={styles.boardWrapper}>
      {/* Left rank labels */}
      <View style={styles.labelCol}>
        {rows.map(row => (
          <View key={row} style={[styles.labelCell, { height: SQUARE_SIZE }]}>
            <Text style={styles.labelText}>{row}</Text>
          </View>
        ))}
      </View>

      <View>
        {/* Board */}
        <View style={[styles.board, { width: BOARD_SIZE, height: BOARD_SIZE }]}>
          {rows.map((row, ri) =>
            cols.map((col, ci) => {
              const sqId = `${col}${row}`;
              const piece = game.get(sqId as any);
              return (
                <ChessSquare
                  key={sqId}
                  squareId={sqId}
                  piece={piece || null}
                  isLight={(ri + ci) % 2 === 0}
                  isSelected={selectedSquare === sqId}
                  isValidMove={validMoves.includes(sqId)}
                  isCheck={checkSquare === sqId}
                  onPress={onSquarePress}
                />
              );
            })
          )}
        </View>

        {/* Bottom file labels */}
        <View style={[styles.labelRow, { width: BOARD_SIZE }]}>
          {cols.map(col => (
            <View key={col} style={[styles.labelCell, { width: SQUARE_SIZE }]}>
              <Text style={styles.labelText}>{col}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  boardWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 4,
    overflow: 'hidden',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
  labelRow: {
    flexDirection: 'row',
    height: 18,
    marginTop: 2,
  },
  labelCol: {
    width: 16,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  labelCell: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelText: {
    fontSize: 10,
    color: '#B8860B',
    fontWeight: '700',
  },
});