import { Player, PlayerPosition } from '../types/Player'
import { Card, Suit, getCardValue, canPlayCard } from '../types/Card'

export function getAIBid(player: Player): number {
  // Simple AI bidding strategy based on hand strength
  const spadesCount = player.hand.filter(card => card.suit === 'spades').length
  const highCardsCount = player.hand.filter(card => {
    const value = getCardValue(card)
    return value >= 11 // J, Q, K, A
  }).length
  
  // Base bid on spades and high cards
  let bid = Math.floor(spadesCount * 0.8) + Math.floor(highCardsCount * 0.6)
  
  // Add some randomness to make AI less predictable
  const randomFactor = Math.random() * 2 - 1 // -1 to 1
  bid += Math.round(randomFactor)
  
  // Ensure bid is between 0 and 13
  return Math.max(0, Math.min(13, bid))
}

export function getAICardToPlay(
  player: Player,
  currentTrick: { cards: { playerId: PlayerPosition; card: Card }[] },
  ledSuit: Suit | null,
  trumpSuit: Suit
): Card | null {
  if (player.hand.length === 0) return null
  
  const validCards = getValidCardsForPlay(player.hand, currentTrick, ledSuit, trumpSuit)
  if (validCards.length === 0) return player.hand[0] // Fallback
  
  // Simple strategy: try to win the trick if possible, otherwise play lowest card
  if (currentTrick.cards.length === 3) {
    // Last player to play - try to win if we can
    return getWinningCard(validCards, currentTrick, ledSuit, trumpSuit)
  } else {
    // Not the last player - play a moderate card
    return getModerateCard(validCards, currentTrick, ledSuit, trumpSuit)
  }
}

function getValidCardsForPlay(
  hand: Card[],
  currentTrick: { cards: { playerId: PlayerPosition; card: Card }[] },
  ledSuit: Suit | null,
  trumpSuit: Suit
): Card[] {
  if (!ledSuit) return hand
  
  const hasLedSuit = hand.some(card => card.suit === ledSuit)
  if (!hasLedSuit) return hand
  
  return hand.filter(card => card.suit === ledSuit || card.suit === trumpSuit)
}

function getWinningCard(
  validCards: Card[],
  currentTrick: { cards: { playerId: PlayerPosition; card: Card }[] },
  ledSuit: Suit | null,
  trumpSuit: Suit
): Card {
  // Find the current winning card in the trick
  let currentWinningCard: Card | null = null
  let currentWinningPlayer: PlayerPosition | null = null
  
  for (const { playerId, card } of currentTrick.cards) {
    if (!currentWinningCard) {
      currentWinningCard = card
      currentWinningPlayer = playerId
    } else {
      // Compare cards to find the winner
      const comparison = compareCardsForWinning(card, currentWinningCard, ledSuit, trumpSuit)
      if (comparison > 0) {
        currentWinningCard = card
        currentWinningPlayer = playerId
      }
    }
  }
  
  // Try to find a card that can beat the current winner
  const winningCards = validCards.filter(card => {
    if (!currentWinningCard) return true
    return compareCardsForWinning(card, currentWinningCard, ledSuit, trumpSuit) > 0
  })
  
  if (winningCards.length > 0) {
    // Play the lowest winning card to conserve high cards
    return winningCards.sort((a, b) => getCardValue(a) - getCardValue(b))[0]
  } else {
    // Can't win, play the lowest card
    return validCards.sort((a, b) => getCardValue(a) - getCardValue(b))[0]
  }
}

function getModerateCard(
  validCards: Card[],
  currentTrick: { cards: { playerId: PlayerPosition; card: Card }[] },
  ledSuit: Suit | null,
  trumpSuit: Suit
): Card {
  // Sort cards by value
  const sortedCards = validCards.sort((a, b) => getCardValue(a) - getCardValue(b))
  
  // Try to play a middle-value card
  const middleIndex = Math.floor(sortedCards.length / 2)
  return sortedCards[middleIndex] || sortedCards[0]
}

function compareCardsForWinning(card1: Card, card2: Card, ledSuit: Suit | null, trumpSuit: Suit): number {
  const value1 = getCardValue(card1)
  const value2 = getCardValue(card2)
  
  // Both cards are trump
  if (card1.suit === trumpSuit && card2.suit === trumpSuit) {
    return value1 - value2
  }
  
  // Only card1 is trump
  if (card1.suit === trumpSuit) return 1
  
  // Only card2 is trump
  if (card2.suit === trumpSuit) return -1
  
  // Neither card is trump, check if they follow led suit
  if (card1.suit === ledSuit && card2.suit === ledSuit) {
    return value1 - value2
  }
  
  // Only card1 follows led suit
  if (card1.suit === ledSuit) return 1
  
  // Only card2 follows led suit
  if (card2.suit === ledSuit) return -1
  
  // Neither card follows led suit (both are off-suit)
  return 0
}