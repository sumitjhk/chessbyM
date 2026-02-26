# ♔ Chess Master

A professional chess app built with **React Native** and **Expo Router**, featuring real 3D chess pieces, local 1v1 gameplay, and an AI opponent with 7 difficulty levels including Grandmaster.

---

## 📱 Screenshots

> Add screenshots of your app here after running it on your device.

---

## ✨ Features

### 🎮 Game Modes
- **Local 1v1** — Play against a friend on the same device with flip board support
- **Play VS Computer** — Challenge the AI across 7 difficulty levels with level progression system
- **Online** *(Coming Soon)* — Play over network
- **Puzzles** *(Coming Soon)* — Tactical challenges
- **Learn Chess** *(Coming Soon)* — Master the basics and openings

### ♟ Chess Features
- Full chess rules powered by **chess.js**
- Click to select piece → highlights valid moves
- Capture ring indicators for capture moves
- King highlight when in check (red)
- Undo move support
- Flip board button
- Move history display
- Captured pieces tracking
- Checkmate / Stalemate / Draw detection

### 🤖 AI Difficulty Levels
| Level | Icon | Description |
|-------|------|-------------|
| Beginner | 🌱 | Just learning the game |
| Easy | 😊 | Casual play |
| Medium | ⚡ | A balanced challenge |
| Hard | 🔥 | For experienced players |
| Expert | 💎 | Serious competition |
| Master | 👑 | Near-professional level |
| Grandmaster | 🏆 | Maximum chess intelligence |

> Levels are **locked by default** — beat each level to unlock the next one. Progress is saved automatically.

### 🎨 UI Design
- Premium dark luxury theme (`#0D0D0D` background)
- Gold (`#D4A843`) and silver piece sets — real 3D images
- Classic wooden board colors (`#F0D9B5` / `#B58863`)
- Gold glow board frame
- Player panels with turn indicators
- Animated AI thinking spinner

---

## 🗂 Project Structure

```
chessApp/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx          # Dashboard / Home screen
│   │   ├── explore.tsx
│   │   └── _layout.tsx
│   ├── game/
│   │   ├── local.tsx          # Local 1v1 game screen
│   │   └── ai.tsx             # VS Computer game screen
│   ├── modal.tsx
│   └── _layout.tsx
│
├── assets/
│   ├── images/
│   │   └── chess-bg.jpg       # Dashboard background
│   └── pieces/                # 3D chess piece images
│       ├── wK.png  wQ.png  wR.png  wB.png  wN.png  wP.png
│       └── bK.png  bQ.png  bR.png  bB.png  bN.png  bP.png
│
├── components/
│   ├── ChessBoard.tsx          # 8x8 board with labels
│   ├── ChessSquare.tsx         # Individual square with piece images
│   └── chessBoardConstants.ts  # SQUARE_SIZE, BOARD_SIZE constants
│
├── styles/
│   ├── homeStyles.ts           # Dashboard styles
│   ├── localStyles.ts          # Local game styles
│   └── aiStyles.ts             # AI game styles
│
├── services/
│   └── ChessAI.ts              # Minimax AI with alpha-beta pruning
│
├── types/
│   └── chess.d.ts
│
├── constants/
│   └── theme.ts
│
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI
- Android Studio or physical Android/iOS device with Expo Go app

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/chessApp.git
cd chessApp

# Install dependencies
npm install

# Install AsyncStorage
npx expo install @react-native-async-storage/async-storage

# Start the development server
npx expo start --clear
```

### Running on Device
1. Install **Expo Go** from Play Store / App Store
2. Scan the QR code shown in terminal
3. App will load on your device

---

## 🧠 AI Engine

The AI uses **Minimax algorithm with Alpha-Beta Pruning** and **Piece-Square Tables** for positional evaluation.

### How it works:
- **Material evaluation** — values each piece (Pawn=100, Knight=320, Bishop=330, Rook=500, Queen=900)
- **Positional evaluation** — rewards good piece placement using piece-square tables
- **Mobility bonus** — rewards having more available moves
- **Move ordering** — evaluates captures first for better pruning efficiency
- **Depth scaling** — higher difficulty = deeper search tree

### Difficulty → Search Depth:
```
Beginner  → depth 1  (80% random moves)
Easy      → depth 2  (40% random moves)
Medium    → depth 3
Hard      → depth 4
Expert    → depth 5
Master    → depth 6
Grandmaster → depth 7
```

---

## 📦 Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| expo | ~52.x | App framework |
| expo-router | ~4.x | File-based routing |
| chess.js | ^1.x | Chess rules engine |
| @react-native-async-storage/async-storage | ^2.x | Save AI progress |
| react-native | 0.76.x | UI framework |

---

## 🛣 Roadmap

- [x] Local 1v1 game
- [x] AI opponent with 7 difficulty levels
- [x] Level progression system
- [x] Real 3D chess piece images
- [x] Undo move
- [x] Move history
- [ ] Online multiplayer
- [ ] Chess puzzles
- [ ] Learn Chess section
- [ ] Move sound effects
- [ ] Game timer / clock
- [ ] Pawn promotion UI
- [ ] Player profiles & stats
- [ ] Stockfish engine integration

---

## 👨‍💻 Built With

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [chess.js](https://github.com/jhlywa/chess.js)
- [Expo Router](https://expo.github.io/router/)

---

## 📄 License

This project is for personal/educational use.

---

> Made with ♟ and passion for chess