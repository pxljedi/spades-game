import { Card } from './Card'
import { PlayerPosition } from './Player'

export type GameAction = 
  | { type: 'START_GAME' }
  | { type: 'DEAL_CARDS' }
  | { type: 'PLACE_BID'; playerId: PlayerPosition; bid: number }
  | { type: 'PLAY_CARD'; playerId: PlayerPosition; card: Card }
  | { type: 'END_TRICK' }
  | { type: 'END_ROUND' }
  | { type: 'RESET_GAME' }
  | { type: 'SET_CURRENT_PLAYER'; playerId: PlayerPosition }

export interface GameActionCreators {
  startGame: () => GameAction
  dealCards: () => GameAction
  placeBid: (playerId: PlayerPosition, bid: number) => GameAction
  playCard: (playerId: PlayerPosition, card: Card) => GameAction
  endTrick: () => GameAction
  endRound: () => GameAction
  resetGame: () => GameAction
  setCurrentPlayer: (playerId: PlayerPosition) => GameAction
}

export const gameActions: GameActionCreators = {
  startGame: () => ({ type: 'START_GAME' }),
  dealCards: () => ({ type: 'DEAL_CARDS' }),
  placeBid: (playerId: PlayerPosition, bid: number) => ({ type: 'PLACE_BID', playerId, bid }),
  playCard: (playerId: PlayerPosition, card: Card) => ({ type: 'PLAY_CARD', playerId, card }),
  endTrick: () => ({ type: 'END_TRICK' }),
  endRound: () => ({ type: 'END_ROUND' }),
  resetGame: () => ({ type: 'RESET_GAME' }),
  setCurrentPlayer: (playerId: PlayerPosition) => ({ type: 'SET_CURRENT_PLAYER', playerId })
}