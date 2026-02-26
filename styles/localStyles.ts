/**
 * LOCAL GAME SCREEN STYLES
 */

import { StyleSheet, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#111111',
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1E1E1E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    color: '#D4A843',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 1,
  },
  headerSubtitle: {
    color: '#666',
    fontSize: 11,
    letterSpacing: 0.5,
    marginTop: 1,
  },
  flipButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1E1E1E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flipText: {
    color: '#D4A843',
    fontSize: 20,
    fontWeight: 'bold',
  },

  // Player panels
  playerPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#141414',
    borderBottomWidth: 1,
    borderBottomColor: '#1E1E1E',
  },
  playerPanelActive: {
    backgroundColor: '#1A1A0A',
    borderBottomColor: '#D4A843',
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  playerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerAvatarText: {
    fontSize: 18,
  },
  playerName: {
    color: '#AAAAAA',
    fontSize: 14,
    fontWeight: '600',
  },
  playerNameActive: {
    color: '#FFFFFF',
  },
  capturedRow: {
    color: '#777',
    fontSize: 13,
    letterSpacing: 2,
    marginTop: 2,
  },
  capturedPiece: {
    fontSize: 13,
  },
  turnIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D4A843',
  },

  // Status bar
  statusBar: {
    alignItems: 'center',
    paddingVertical: 6,
    backgroundColor: '#0D0D0D',
  },
  statusText: {
    color: '#D4A843',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
  },

  // Board
  boardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: '#0D0D0D',
  },
  boardFrame: {
    padding: 8,
    backgroundColor: '#1A1208',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D4A84340',
    elevation: 20,
    shadowColor: '#D4A843',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },

  // Controls
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#0D0D0D',
    borderTopWidth: 1,
    borderTopColor: '#1E1E1E',
  },
  controlButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    gap: 2,
  },
  controlButtonDanger: {
    backgroundColor: '#1A0A0A',
    borderColor: '#8B2020',
  },
  controlIcon: {
    fontSize: 16,
  },
  controlButtonText: {
    color: '#CCCCCC',
    fontSize: 11,
    fontWeight: '600',
  },
  controlButtonTextDanger: {
    color: '#E74C3C',
  },

  // Move history
  historyContainer: {
    backgroundColor: '#0D0D0D',
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 8,
    flex: 1,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  historyTitle: {
    color: '#555',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  historyLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#1E1E1E',
  },
  historyScroll: {
    maxHeight: 60,
  },
  historyRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  historyMoveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  historyNumber: {
    color: '#444',
    fontSize: 12,
  },
  historyMove: {
    color: '#DDDDDD',
    fontSize: 12,
    fontWeight: '600',
    marginHorizontal: 2,
  },
  historyMoveWhite: {
    color: '#DDDDDD',
    fontSize: 12,
    fontWeight: '600',
    marginHorizontal: 2,
  },
  historyMoveBlack: {
    color: '#888888',
    fontSize: 12,
    marginLeft: 2,
  },
});