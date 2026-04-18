import { GameState, createInitialGameState, Trick } from '../types/GameState'
import { Player, PlayerPosition, createPlayer, getNextPosition } from '../types/Player'
import { Card, Suit, compareCards } from '../types/Card'
import { GameAction } from '../types/GameActions'
import { createDeck, shuffleDeck, dealCards, sortHand } from './deck'
import { calculateRoundScore } from './scoring'

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      const players = [
        createPlayer('north', 'ai'),
        createPlayer('east', 'ai'),
        createPlayer('south', 'human'),
        createPlayer('west', 'ai')
      ]
      
      return {
        ...state,
        phase: 'dealing',
        players
      }

    case 'DEAL_CARDS':
      const deck = shuffleDeck(createDeck())
      const hands = dealCards(deck, 4, 13)
      
      const updatedPlayers = state.players.map((player, index) => ({
        ...player,
        hand: sortHand(hands[index]),
        bid: null,
        tricksWon: 0
      }))
      
      return {
        ...state,
        phase: 'bidding',
        deck,
        players: updatedPlayers,
        currentPlayer: 'north',
        currentTrick: {
          cards: [],
          ledSuit: null,
          winner: null,
          status: 'in-progress'
        },
        totalTricksThisRound: 0
      }

    case 'PLACE_BID':
      const playerWithBid = state.players.find(p => p.id === action.playerId)
      if (!playerWithBid) return state
      
      const updatedPlayersWithBid = state.players.map(player =>
        player.id === action.playerId
          ? { ...player, bid: action.bid }
          : player
      )
      
      const allPlayersBid = updatedPlayersWithBid.every(p => p.bid !== null)
      const nextPlayer = getNextPosition(action.playerId)
      
      return {
        ...state,
        players: updatedPlayersWithBid,
        currentPlayer: allPlayersBid ? 'north' : nextPlayer,
        phase: allPlayersBid ? 'playing' : 'bidding'
      }

    case 'PLAY_CARD':
      const playingPlayer = state.players.find(p => p.id === action.playerId)
      if (!playingPlayer) return state
      
      // Remove card from player's hand
      const updatedPlayersAfterPlay = state.players.map(player =>
        player.id === action.playerId
          ? {
              ...player,
              hand: player.hand.filter(card => card.id !== action.card.id)
            }
          : player
      )
      
      // Add card to current trick
      const newTrickCards = [...state.currentTrick.cards, {
        playerId: action.playerId,
        card: action.card
      }]
      
      const ledSuit = state.currentTrick.ledSuit || action.card.suit
      
      const updatedTrick: Trick = {
        ...state.currentTrick,
        cards: newTrickCards,
        ledSuit
      }
      
      // Check if trick is complete
      if (newTrickCards.length === 4) {
        const winner = determineTrickWinner(newTrickCards, ledSuit, state.trumpSuit)
        updatedTrick.winner = winner
        updatedTrick.status = 'complete'
        
        // Update player's tricks won
        const updatedPlayersWithTricks = updatedPlayersAfterPlay.map(player =>
          player.id === winner
            ? { ...player, tricksWon: player.tricksWon + 1 }
            : player
        )
        
        return {
          ...state,
          players: updatedPlayersWithTricks,
          currentTrick: updatedTrick,
          currentPlayer: winner,
          totalTricksThisRound: state.totalTricksThisRound + 1
        }
      }
      
      // Trick is still in progress
      const nextPlayerInTrick = getNextPosition(action.playerId)
      
      return {
        ...state,
        players: updatedPlayersAfterPlay,
        currentTrick: updatedTrick,
        currentPlayer: nextPlayerInTrick
      }

    case 'END_TRICK':
      // Reset trick for next round
      return {
        ...state,
        currentTrick: {
          cards: [],
          ledSuit: null,
          winner: null,
          status: 'in-progress'
        }
      }

    case 'END_ROUND':
      const roundScore = calculateRoundScore(state.players)
      
      return {
        ...state,
        phase: 'scoring',
        playerScores: {
          north: state.playerScores.north + roundScore.northScore,
          east: state.playerScores.east + roundScore.eastScore,
          south: state.playerScores.south + roundScore.southScore,
          west: state.playerScores.west + roundScore.westScore
        },
        roundHistory: [...state.roundHistory, roundScore]
      }

    case 'RESET_GAME':
      return createInitialGameState()

    case 'SET_CURRENT_PLAYER':
      return {
        ...state,
        currentPlayer: action.playerId
      }

    default:
      return state
  }
}

function determineTrickWinner(trickCards: { playerId: PlayerPosition; card: Card }[], ledSuit: Suit, trumpSuit: Suit): PlayerPosition {
  let winningCard = trickCards[0]
  
  for (let i = 1; i < trickCards.length; i++) {
    const comparison = compareCards(winningCard.card, trickCards[i].card, ledSuit, trumpSuit)
    if (comparison < 0) {
      winningCard = trickCards[i]
    }
  }
  
  return winningCard.playerId
}
