import { Card, Suit } from './Card'
import { Player, PlayerPosition } from './Player'

export type GamePhase = 'setup' | 'dealing' | 'bidding' | 'playing' | 'scoring' | 'finished'
export type TrickStatus = 'in-progress' | 'complete'

export interface Trick {
  cards: { playerId: PlayerPosition; card: Card }[]
  ledSuit: Suit | null
  winner: PlayerPosition | null
  status: TrickStatus
}

// Solo round score snapshot (no teams)
export interface RoundScore {
  northBid: number
  northTricks: number
  northScore: number
  eastBid: number
  eastTricks: number
  eastScore: number
  southBid: number
  southTricks: number
  southScore: number
  westBid: number
  westTricks: number
  westScore: number
}

export interface GameState {
  phase: GamePhase
  players: Player[]
  deck: Card[]
  currentPlayer: PlayerPosition
  currentTrick: Trick
  trumpSuit: Suit
  roundNumber: number
  // Solo cumulative scores per seat
  playerScores: {
    north: number
    east: number
    south: number
    west: number
  }
  roundHistory: RoundScore[]
  biddingComplete: boolean
  totalTricksThisRound: number
}

export function createInitialGameState(): GameState {
  return {
    phase: 'setup',
    players: [],
    deck: [],
    currentPlayer: 'north',
    currentTrick: {
      cards: [],
      ledSuit: null,
      winner: null,
      status: 'in-progress'
    },
    trumpSuit: 'spades',
    roundNumber: 1,
    playerScores: {
      north: 0,
      east: 0,
      south: 0,
      west: 0
    },
    roundHistory: [],
    biddingComplete: false,
    totalTricksThisRound: 0
  }
}
