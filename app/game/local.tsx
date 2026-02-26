/**
 * LOCAL 1v1 CHESS GAME — PREMIUM UI
 */

import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Chess } from 'chess.js';
import ChessBoard from '../../components/ChessBoard';
import styles from '../../styles/localStyles';

const PIECE_SYMBOLS: Record<string, string> = {
  wk: '♔', wq: '♕', wr: '♖', wb: '♗', wn: '♘', wp: '♙',
  bk: '♚', bq: '♛', br: '♜', bb: '♝', bn: '♞', bp: '♟',
};

export default function LocalGameScreen() {
  const router = useRouter();

  // KEY FIX: Store Chess instance in a ref so move history is never lost.
  // A version counter triggers re-renders instead.
  const gameRef = useRef(new Chess());
  const [version, setVersion] = useState(0);
  const forceUpdate = () => setVersion(v => v + 1);

  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [validMoves, setValidMoves] = useState<string[]>([]);
  const [flipped, setFlipped] = useState(false);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [capturedByWhite, setCapturedByWhite] = useState<string[]>([]);
  const [capturedByBlack, setCapturedByBlack] = useState<string[]>([]);

  const game = gameRef.current;
  const isCheck = game.isCheck();
  const isCheckmate = game.isCheckmate();
  const isStalemate = game.isStalemate();
  const isDraw = game.isDraw();
  const turn = game.turn();
  const isWhiteTurn = turn === 'w';

  const handleSquarePress = useCallback((squareId: string) => {
    const g = gameRef.current;
    if (g.isGameOver()) return;

    const piece = g.get(squareId as any);

    if (selectedSquare) {
      if (validMoves.includes(squareId)) {
        const move = g.move({ from: selectedSquare, to: squareId, promotion: 'q' });
        if (move) {
          if (move.captured) {
            const sym = PIECE_SYMBOLS[`${move.color === 'w' ? 'b' : 'w'}${move.captured}`] || '';
            if (move.color === 'w') {
              setCapturedByWhite(p => [...p, sym]);
            } else {
              setCapturedByBlack(p => [...p, sym]);
            }
          }
          setMoveHistory(p => [...p, move.san]);
          setSelectedSquare(null);
          setValidMoves([]);
          forceUpdate();

          if (g.isCheckmate()) {
            const winner = g.turn() === 'w' ? 'Black' : 'White';
            setTimeout(() => {
              Alert.alert('Checkmate! 🏆', `${winner} wins!`, [
                { text: 'New Game', onPress: resetGame },
                { text: 'Back', onPress: () => router.back() },
              ]);
            }, 300);
          } else if (g.isDraw() || g.isStalemate()) {
            setTimeout(() => {
              Alert.alert('Draw!', 'The game ended in a draw.', [
                { text: 'New Game', onPress: resetGame },
                { text: 'Back', onPress: () => router.back() },
              ]);
            }, 300);
          }
          return;
        }
      }

      if (piece && piece.color === g.turn()) {
        setSelectedSquare(squareId);
        const moves = g.moves({ square: squareId as any, verbose: true });
        setValidMoves(moves.map((m: any) => m.to));
        return;
      }

      setSelectedSquare(null);
      setValidMoves([]);
      return;
    }

    if (piece && piece.color === g.turn()) {
      setSelectedSquare(squareId);
      const moves = g.moves({ square: squareId as any, verbose: true });
      setValidMoves(moves.map((m: any) => m.to));
    }
  }, [selectedSquare, validMoves]);

  // FIXED UNDO — calls undo() on the ref (which has full history), then re-renders
  const undoMove = () => {
    const g = gameRef.current;
    if (moveHistory.length === 0) return;

    const undone = g.undo();
    if (!undone) return;

    if (undone.captured) {
      if (undone.color === 'w') {
        setCapturedByWhite(p => p.slice(0, -1));
      } else {
        setCapturedByBlack(p => p.slice(0, -1));
      }
    }

    setMoveHistory(p => p.slice(0, -1));
    setSelectedSquare(null);
    setValidMoves([]);
    forceUpdate(); // re-render the board
  };

  const resetGame = () => {
    gameRef.current = new Chess();
    setMoveHistory([]);
    setCapturedByWhite([]);
    setCapturedByBlack([]);
    setSelectedSquare(null);
    setValidMoves([]);
    forceUpdate();
  };

  const resign = () => {
    Alert.alert('Resign?', 'Are you sure you want to resign?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Resign', style: 'destructive', onPress: () => {
          const winner = isWhiteTurn ? 'Black' : 'White';
          Alert.alert(`${winner} Wins!`, 'Your opponent wins by resignation.', [
            { text: 'New Game', onPress: resetGame },
            { text: 'Back', onPress: () => router.back() },
          ]);
        }
      },
    ]);
  };

  const statusText = isCheckmate
    ? `Checkmate! ${isWhiteTurn ? 'Black' : 'White'} wins 🏆`
    : isStalemate ? 'Stalemate — Draw'
    : isDraw ? 'Draw'
    : isCheck ? `⚠ ${isWhiteTurn ? 'White' : 'Black'} is in CHECK!`
    : `${isWhiteTurn ? '♔ White' : '♚ Black'}'s Turn`;

  const blackPanel = (
    <View style={[styles.playerPanel, !isWhiteTurn && styles.playerPanelActive]}>
      <View style={styles.playerInfo}>
        <View style={[styles.playerAvatar, { backgroundColor: '#1A1A1A', borderColor: '#555', borderWidth: 2 }]}>
          <Text style={{ fontSize: 20 }}>♚</Text>
        </View>
        <View>
          <Text style={[styles.playerName, !isWhiteTurn && styles.playerNameActive]}>Black Player</Text>
          <Text style={styles.capturedRow}>{capturedByBlack.join(' ')}</Text>
        </View>
      </View>
      {!isWhiteTurn && !game.isGameOver() && <View style={styles.turnIndicator} />}
    </View>
  );

  const whitePanel = (
    <View style={[styles.playerPanel, isWhiteTurn && styles.playerPanelActive]}>
      <View style={styles.playerInfo}>
        <View style={[styles.playerAvatar, { backgroundColor: '#F0D9B5', borderColor: '#D4A843', borderWidth: 2 }]}>
          <Text style={{ fontSize: 20 }}>♔</Text>
        </View>
        <View>
          <Text style={[styles.playerName, isWhiteTurn && styles.playerNameActive]}>White Player</Text>
          <Text style={styles.capturedRow}>{capturedByWhite.join(' ')}</Text>
        </View>
      </View>
      {isWhiteTurn && !game.isGameOver() && <View style={styles.turnIndicator} />}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Local 1v1</Text>
        </View>
        <TouchableOpacity style={styles.flipButton} onPress={() => setFlipped(f => !f)}>
          <Text style={styles.flipText}>⇅</Text>
        </TouchableOpacity>
      </View>

      {/* Status bar */}
      <View style={[styles.statusBar, isCheck && !isCheckmate ? { backgroundColor: '#C0392B' } : {}]}>
        <Text style={styles.statusText}>{statusText}</Text>
      </View>

      {blackPanel}

      <View style={styles.boardContainer}>
        <View style={styles.boardFrame}>
          <ChessBoard
            game={game}
            selectedSquare={selectedSquare}
            validMoves={validMoves}
            flipped={flipped}
            onSquarePress={handleSquarePress}
          />
        </View>
      </View>

      {whitePanel}

      {/* Controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[styles.controlButton, moveHistory.length === 0 && { opacity: 0.4 }]}
          onPress={undoMove}
          disabled={moveHistory.length === 0}
        >
          <Text style={styles.controlIcon}>↩</Text>
          <Text style={styles.controlButtonText}>Undo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton} onPress={resetGame}>
          <Text style={styles.controlIcon}>↺</Text>
          <Text style={styles.controlButtonText}>New Game</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.controlButton, styles.controlButtonDanger]} onPress={resign}>
          <Text style={styles.controlIcon}>🏳</Text>
          <Text style={[styles.controlButtonText, { color: '#E74C3C' }]}>Resign</Text>
        </TouchableOpacity>
      </View>

      {/* Move history */}
      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>Move History</Text>
        <ScrollView horizontal style={styles.historyScroll} showsHorizontalScrollIndicator={false}>
          <View style={styles.historyRow}>
            {moveHistory.map((move, i) => (
              <Text key={i} style={styles.historyMove}>
                {i % 2 === 0 ? <Text style={styles.historyNumber}>{Math.floor(i / 2) + 1}. </Text> : null}
                {move}{' '}
              </Text>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}