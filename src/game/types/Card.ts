export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades'
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A'

export interface Card {
  suit: Suit
  rank: Rank
  id: string
}

export const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades']
export const RANKS: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']

export const SUIT_SYMBOLS = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠'
} as const

export const SUIT_COLORS = {
  hearts: 'red',
  diamonds: 'red',
  clubs: 'black',
  spades: 'black'
} as const

export const RANK_VALUES = {
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 10,
  'J': 11,
  'Q': 12,
  'K': 13,
  'A': 14
} as const

export function createCard(suit: Suit, rank: Rank): Card {
  return {
    suit,
    rank,
    id: `${rank}-${suit}`
  }
}

export function getCardValue(card: Card): number {
  return RANK_VALUES[card.rank]
}

export function canPlayCard(card: Card, hand: Card[], ledSuit: Suit | null, trumpSuit: Suit): boolean {
  if (!ledSuit) return true
  
  const hasLedSuit = hand.some(c => c.suit === ledSuit)
  if (!hasLedSuit) return true
  
  return card.suit === ledSuit || card.suit === trumpSuit
}

export function compareCards(card1: Card, card2: Card, ledSuit: Suit, trumpSuit: Suit): number {
  const value1 = getCardValue(card1)
  const value2 = getCardValue(card2)
  
  // Both cards are trump
  if (card1.suit === trumpSuit && card2.suit === trumpSuit) {
    return value2 - value1
  }
  
  // Only card1 is trump
  if (card1.suit === trumpSuit) return 1
  
  // Only card2 is trump
  if (card2.suit === trumpSuit) return -1
  
  // Neither card is trump, check if they follow led suit
  if (card1.suit === ledSuit && card2.suit === ledSuit) {
    return value2 - value1
  }
  
  // Only card1 follows led suit
  if (card1.suit === ledSuit) return 1
  
  // Only card2 follows led suit
  if (card2.suit === ledSuit) return -1
  
  // Neither card follows led suit (both are off-suit)
  return 0
}