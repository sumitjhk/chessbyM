/**
 * PLAY VS COMPUTER SCREEN
 * With level progression system and working undo
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, SafeAreaView,
  ScrollView, Alert, StatusBar, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Chess } from 'chess.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChessBoard from '../../components/ChessBoard';
import { chessAI } from '../../services/ChessAI';
import styles from '../../styles/aiStyles';

const PIECE_SYMBOLS: Record<string, string> = {
  wk: '♔', wq: '♕', wr: '♖', wb: '♗', wn: '♘', wp: '♙',
  bk: '♚', bq: '♛', br: '♜', bb: '♝', bn: '♞', bp: '♟',
};

type Difficulty = 'beginner' | 'easy' | 'medium' | 'hard' | 'expert' | 'master' | 'grandmaster';

const DIFFICULTIES = [
  { key: 'beginner',    label: 'Beginner',    desc: 'Just learning the game',      icon: '🌱', color: '#2ECC71' },
  { key: 'easy',        label: 'Easy',         desc: 'Casual play',                 icon: '😊', color: '#27AE60' },
  { key: 'medium',      label: 'Medium',       desc: 'A balanced challenge',        icon: '⚡', color: '#F39C12' },
  { key: 'hard',        label: 'Hard',         desc: 'For experienced players',     icon: '🔥', color: '#E67E22' },
  { key: 'expert',      label: 'Expert',       desc: 'Serious competition',         icon: '💎', color: '#E74C3C' },
  { key: 'master',      label: 'Master',       desc: 'Near-professional level',     icon: '👑', color: '#9B59B6' },
  { key: 'grandmaster', label: 'Grandmaster',  desc: 'Maximum chess intelligence',  icon: '🏆', color: '#D4A843' },
] as const;

const STORAGE_KEY = 'chess_unlocked_level';

export default function AIGameScreen() {
  const router = useRouter();

  // KEY FIX: useRef so move history is preserved for undo
  const gameRef = useRef(new Chess());
  const [, setVersion] = useState(0);
  const forceUpdate = () => setVersion(v => v + 1);

  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [validMoves, setValidMoves] = useState<string[]>([]);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [capturedByPlayer, setCapturedByPlayer] = useState<string[]>([]);
  const [capturedByAI, setCapturedByAI] = useState<string[]>([]);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [gameStarted, setGameStarted] = useState(false);
  const [unlockedLevel, setUnlockedLevel] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(true);

  const game = gameRef.current;
  const playerColor = 'w';
  const isPlayerTurn = game.turn() === playerColor;

  useEffect(() => { loadProgress(); }, []);

  const loadProgress = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved !== null) setUnlockedLevel(parseInt(saved));
    } catch (e) {}
    finally { setLoadingProgress(false); }
  };

  const saveProgress = async (level: number) => {
    try { await AsyncStorage.setItem(STORAGE_KEY, level.toString()); } catch (e) {}
  };

  const getStatusText = () => {
    if (game.isCheckmate()) return '⚡ CHECKMATE';
    if (game.isCheck()) return isPlayerTurn ? '⚠ YOUR KING IN CHECK' : '⚠ AI KING IN CHECK';
    if (game.isStalemate()) return 'STALEMATE';
    if (game.isDraw()) return 'DRAW';
    if (isAIThinking) return '🤖 THINKING...';
    return isPlayerTurn ? 'YOUR TURN' : "AI'S TURN";
  };

  // AI move trigger — runs when it's AI's turn
  useEffect(() => {
    if (!gameStarted || game.isGameOver() || isPlayerTurn) return;
    setIsAIThinking(true);

    const timer = setTimeout(async () => {
      try {
        chessAI.setDifficulty(difficulty);
        const bestMove = await chessAI.getBestMoveAdvanced(game.fen());
        if (bestMove) {
          const g = gameRef.current;
          const from = bestMove.slice(0, 2);
          const to = bestMove.slice(2, 4);
          const promotion = bestMove.slice(4) || undefined;
          const move = g.move({ from: from as any, to: to as any, promotion });
          if (move) {
            if (move.captured) {
              const sym = PIECE_SYMBOLS[`${move.color === 'w' ? 'b' : 'w'}${move.captured}`] || '';
              setCapturedByAI(p => [...p, sym]);
            }
            setMoveHistory(p => [...p, move.san]);
            forceUpdate();
            if (g.isCheckmate()) handleAIWin();
            else if (g.isDraw()) {
              Alert.alert('Draw!', 'The game ended in a draw. Try again!', [
                { text: 'Try Again', onPress: resetGameBoard },
              ]);
            }
          }
        }
      } catch (e) { console.error('AI error:', e); }
      finally { setIsAIThinking(false); }
    }, 600);

    return () => clearTimeout(timer);
  }, [moveHistory.length, isPlayerTurn, gameStarted]);

  const handlePlayerWin = async () => {
    const currentIndex = DIFFICULTIES.findIndex(d => d.key === difficulty);
    const nextIndex = currentIndex + 1;
    const isLastLevel = nextIndex >= DIFFICULTIES.length;

    if (nextIndex > unlockedLevel) {
      setUnlockedLevel(nextIndex);
      await saveProgress(nextIndex);
    }

    if (isLastLevel) {
      Alert.alert('🏆 GRANDMASTER CONQUERED!', 'You have beaten all levels! You are a true Chess Master!', [
        { text: 'Amazing!', onPress: resetGame },
      ]);
    } else {
      const next = DIFFICULTIES[nextIndex];
      Alert.alert(
        '🎉 Level Unlocked!',
        `You beat ${DIFFICULTIES[currentIndex].label}!\n\n${next.icon} ${next.label} is now unlocked!`,
        [
          { text: 'Play Next Level', onPress: () => { resetGameBoard(); setDifficulty(next.key as Difficulty); setGameStarted(true); } },
          { text: 'Back to Levels', onPress: resetGame },
        ]
      );
    }
  };

  const handleAIWin = () => {
    const current = DIFFICULTIES.find(d => d.key === difficulty)!;
    Alert.alert(
      '😔 AI Wins',
      `You need to beat ${current.label} to advance.\nKeep practicing!`,
      [
        { text: 'Try Again', onPress: resetGameBoard },
        { text: 'Back to Levels', onPress: resetGame },
      ]
    );
  };

  const handleSquarePress = useCallback((squareId: string) => {
    const g = gameRef.current;
    if (!isPlayerTurn || isAIThinking || g.isGameOver()) return;

    const piece = g.get(squareId as any);

    if (selectedSquare) {
      if (validMoves.includes(squareId)) {
        const move = g.move({ from: selectedSquare as any, to: squareId as any, promotion: 'q' });
        if (move) {
          if (move.captured) {
            const sym = PIECE_SYMBOLS[`${move.color === 'w' ? 'b' : 'w'}${move.captured}`] || '';
            setCapturedByPlayer(p => [...p, sym]);
          }
          setMoveHistory(p => [...p, move.san]);
          forceUpdate();
          if (g.isCheckmate()) handlePlayerWin();
        }
        setSelectedSquare(null);
        setValidMoves([]);
      } else if (piece && piece.color === playerColor) {
        setSelectedSquare(squareId);
        setValidMoves(g.moves({ square: squareId as any, verbose: true }).map((m: any) => m.to));
      } else {
        setSelectedSquare(null);
        setValidMoves([]);
      }
    } else {
      if (piece && piece.color === playerColor) {
        setSelectedSquare(squareId);
        setValidMoves(g.moves({ square: squareId as any, verbose: true }).map((m: any) => m.to));
      }
    }
  }, [selectedSquare, validMoves, isPlayerTurn, isAIThinking]);

  // UNDO: undoes both the AI move AND the player's move (one full round)
  const undoMove = () => {
    const g = gameRef.current;
    // Need at least 2 moves (player + AI) to undo a full round
    if (moveHistory.length < 1) return;

    // Undo AI's move first
    const aiUndone = g.undo();
    if (aiUndone?.captured) setCapturedByAI(p => p.slice(0, -1));

    // Then undo player's move
    const playerUndone = g.undo();
    if (playerUndone?.captured) setCapturedByPlayer(p => p.slice(0, -1));

    setMoveHistory(p => p.slice(0, -2));
    setSelectedSquare(null);
    setValidMoves([]);
    forceUpdate();
  };

  const resetGameBoard = () => {
    gameRef.current = new Chess();
    setSelectedSquare(null);
    setValidMoves([]);
    setMoveHistory([]);
    setCapturedByPlayer([]);
    setCapturedByAI([]);
    setIsAIThinking(false);
    forceUpdate();
  };

  const resetGame = () => {
    resetGameBoard();
    setGameStarted(false);
  };

  // ── DIFFICULTY SELECTION SCREEN ──
  if (!gameStarted) {
    if (loadingProgress) {
      return (
        <SafeAreaView style={styles.container}>
          <ActivityIndicator color="#D4A843" size="large" style={{ flex: 1 }} />
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#111111" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>VS COMPUTER</Text>
            <Text style={styles.headerSubtitle}>LEVEL PROGRESSION</Text>
          </View>
          <View style={{ width: 38 }} />
        </View>

        <ScrollView style={styles.difficultyContainer} showsVerticalScrollIndicator={false}>
          <Text style={styles.difficultyTitle}>Choose Your Challenge</Text>
          <Text style={styles.difficultySubtitle}>Beat each level to unlock the next 🔒</Text>

          {DIFFICULTIES.map((d, index) => {
            const isUnlocked = index <= unlockedLevel;
            const isCompleted = index < unlockedLevel;

            return (
              <TouchableOpacity
                key={d.key}
                style={[
                  styles.difficultyCard,
                  { borderColor: isUnlocked ? d.color : '#333' },
                  !isUnlocked && styles.difficultyCardLocked,
                ]}
                onPress={() => {
                  if (!isUnlocked) {
                    Alert.alert('🔒 Locked', `Beat ${DIFFICULTIES[index - 1].label} first!`);
                    return;
                  }
                  setDifficulty(d.key as Difficulty);
                  setGameStarted(true);
                }}
                activeOpacity={isUnlocked ? 0.8 : 1}
              >
                <Text style={[styles.difficultyIcon, !isUnlocked && { opacity: 0.3 }]}>
                  {isCompleted ? '✅' : isUnlocked ? d.icon : '🔒'}
                </Text>
                <View style={styles.difficultyInfo}>
                  <Text style={[styles.difficultyLabel, { color: isUnlocked ? d.color : '#444' }]}>
                    {d.label}
                  </Text>
                  <Text style={[styles.difficultyDesc, !isUnlocked && { color: '#333' }]}>
                    {isCompleted ? 'Completed ✓' : isUnlocked ? d.desc : `Unlock by beating ${DIFFICULTIES[index - 1]?.label}`}
                  </Text>
                </View>
                {isUnlocked && <Text style={[styles.difficultyArrow, { color: d.color }]}>→</Text>}
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity
            style={styles.resetProgressButton}
            onPress={() => Alert.alert('Reset Progress?', 'This will lock all levels except Beginner.', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Reset', style: 'destructive', onPress: async () => {
                setUnlockedLevel(0);
                await saveProgress(0);
              }},
            ])}
          >
            <Text style={styles.resetProgressText}>Reset Progress</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── GAME SCREEN ──
  const currentDiff = DIFFICULTIES.find(d => d.key === difficulty)!;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#111111" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={resetGame}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>VS COMPUTER</Text>
          <Text style={[styles.headerSubtitle, { color: currentDiff.color }]}>
            {currentDiff.icon} {currentDiff.label.toUpperCase()}
          </Text>
        </View>
        <View style={{ width: 38 }} />
      </View>

      {/* AI Panel */}
      <View style={[styles.playerPanel, !isPlayerTurn && styles.playerPanelActive]}>
        <View style={styles.playerInfo}>
          <View style={[styles.playerAvatar, { backgroundColor: '#1A1A1A' }]}>
            <Text style={styles.playerAvatarText}>🤖</Text>
          </View>
          <View>
            <Text style={[styles.playerName, !isPlayerTurn && styles.playerNameActive]}>
              Computer ({currentDiff.label})
            </Text>
            <View style={styles.capturedRow}>
              {capturedByAI.map((p, i) => <Text key={i} style={styles.capturedPiece}>{p}</Text>)}
            </View>
          </View>
        </View>
        {isAIThinking
          ? <ActivityIndicator color="#D4A843" size="small" />
          : !isPlayerTurn && !game.isGameOver() && <View style={styles.turnIndicator} />
        }
      </View>

      <View style={[styles.statusBar, game.isCheck() && !game.isCheckmate() ? { backgroundColor: '#C0392B' } : {}]}>
        <Text style={styles.statusText}>{getStatusText()}</Text>
      </View>

      <View style={styles.boardContainer}>
        <View style={styles.boardFrame}>
          <ChessBoard
            game={game}
            selectedSquare={selectedSquare}
            validMoves={validMoves}
            flipped={false}
            onSquarePress={handleSquarePress}
          />
        </View>
      </View>

      {/* Player Panel */}
      <View style={[styles.playerPanel, isPlayerTurn && styles.playerPanelActive]}>
        <View style={styles.playerInfo}>
          <View style={[styles.playerAvatar, { backgroundColor: '#F0D9B5', borderWidth: 2, borderColor: '#D4A843' }]}>
            <Text style={styles.playerAvatarText}>♔</Text>
          </View>
          <View>
            <Text style={[styles.playerName, isPlayerTurn && styles.playerNameActive]}>You</Text>
            <View style={styles.capturedRow}>
              {capturedByPlayer.map((p, i) => <Text key={i} style={styles.capturedPiece}>{p}</Text>)}
            </View>
          </View>
        </View>
        {isPlayerTurn && !game.isGameOver() && <View style={styles.turnIndicator} />}
      </View>

      {/* Controls — now includes Undo */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[styles.controlButton, moveHistory.length < 2 && { opacity: 0.4 }]}
          onPress={undoMove}
          disabled={moveHistory.length < 2}
        >
          <Text style={styles.controlIcon}>↩</Text>
          <Text style={styles.controlButtonText}>Undo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton} onPress={resetGameBoard}>
          <Text style={styles.controlIcon}>↺</Text>
          <Text style={styles.controlButtonText}>Retry</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton} onPress={resetGame}>
          <Text style={styles.controlIcon}>☰</Text>
          <Text style={styles.controlButtonText}>Levels</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.controlButtonDanger]}
          onPress={() => Alert.alert('Resign?', 'You will forfeit the game.', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Resign', style: 'destructive', onPress: handleAIWin },
          ])}
        >
          <Text style={styles.controlIcon}>🏳</Text>
          <Text style={[styles.controlButtonText, styles.controlButtonTextDanger]}>Resign</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.historyContainer}>
        <View style={styles.historyHeader}>
          <Text style={styles.historyTitle}>Move History</Text>
          <View style={styles.historyLine} />
        </View>
        <ScrollView style={styles.historyScroll}>
          <View style={styles.historyRow}>
            {Array.from({ length: Math.ceil(moveHistory.length / 2) }, (_, i) => (
              <View key={i} style={styles.historyMoveContainer}>
                <Text style={styles.historyNumber}>{i + 1}.</Text>
                <Text style={styles.historyMoveWhite}>{moveHistory[i * 2]}</Text>
                {moveHistory[i * 2 + 1] && (
                  <Text style={styles.historyMoveBlack}>{moveHistory[i * 2 + 1]}</Text>
                )}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}