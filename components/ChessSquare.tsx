import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SQUARE_SIZE } from './chessBoardConstants';

interface Props {
  squareId: string;
  piece: { type: string; color: string } | null;
  isLight: boolean;
  isSelected: boolean;
  isValidMove: boolean;
  isCheck: boolean;
  onPress: (squareId: string) => void;
}

const PIECE_IMAGES: Record<string, any> = {
  wk: require('../assets/pieces/wK.png'),
  wq: require('../assets/pieces/wQ.png'),
  wr: require('../assets/pieces/wR.png'),
  wb: require('../assets/pieces/wB.png'),
  wn: require('../assets/pieces/wN.png'),
  wp: require('../assets/pieces/wP.png'),
  bk: require('../assets/pieces/bK.png'),
  bq: require('../assets/pieces/bQ.png'),
  br: require('../assets/pieces/bR.png'),
  bb: require('../assets/pieces/bB.png'),
  bn: require('../assets/pieces/bN.png'),
  bp: require('../assets/pieces/bP.png'),
};

export default function ChessSquare({
  squareId, piece, isLight, isSelected, isValidMove, isCheck, onPress,
}: Props) {
  const getBg = () => {
    if (isSelected) return '#F6F669';
    if (isCheck) return '#C0392B';
    return isLight ? '#F0D9B5' : '#B58863';
  };

  const pieceKey = piece ? `${piece.color}${piece.type}` : null;
  const pieceImage = pieceKey ? PIECE_IMAGES[pieceKey] : null;

  return (
    <TouchableOpacity
      style={[styles.square, { backgroundColor: getBg() }]}
      onPress={() => onPress(squareId)}
      activeOpacity={0.85}
    >
      {isSelected && (
        <View style={[StyleSheet.absoluteFillObject, styles.selectedOverlay]} />
      )}
      {isValidMove && !piece && (
        <View style={styles.moveDot} />
      )}
      {isValidMove && piece && (
        <View style={styles.captureRing} />
      )}
      {pieceImage && (
        <View style={[
          styles.pieceWrapper,
          { backgroundColor: getBg() }  // match square color to hide white bg
        ]}>
          <Image
            source={pieceImage}
            style={styles.pieceImage}
            resizeMode="contain"
          />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  square: {
    width: SQUARE_SIZE,
    height: SQUARE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedOverlay: {
    backgroundColor: 'rgba(246,246,105,0.4)',
  },
  pieceWrapper: {
    width: SQUARE_SIZE * 0.88,
    height: SQUARE_SIZE * 0.88,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  pieceImage: {
    width: SQUARE_SIZE * 0.88,
    height: SQUARE_SIZE * 0.88,
  },
  moveDot: {
    position: 'absolute',
    width: SQUARE_SIZE * 0.32,
    height: SQUARE_SIZE * 0.32,
    borderRadius: SQUARE_SIZE * 0.16,
    backgroundColor: 'rgba(0,0,0,0.22)',
  },
  captureRing: {
    position: 'absolute',
    width: SQUARE_SIZE * 0.92,
    height: SQUARE_SIZE * 0.92,
    borderRadius: SQUARE_SIZE * 0.46,
    borderWidth: 5,
    borderColor: 'rgba(0,0,0,0.22)',
  },
});