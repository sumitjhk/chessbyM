import { Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
export const SQUARE_SIZE = Math.floor(SCREEN_WIDTH / 8);
export const BOARD_SIZE = SQUARE_SIZE * 8;