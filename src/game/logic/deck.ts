import { Card, Suit, Rank, SUITS, RANKS, createCard } from '../types/Card'

export function createDeck(): Card[] {
  const deck: Card[] = []
  
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push(createCard(suit, rank))
    }
  }
  
  return deck
}

export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck]
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  
  return shuffled
}

export function dealCards(deck: Card[], numPlayers: number, cardsPerPlayer: number): Card[][] {
  const hands: Card[][] = Array(numPlayers).fill(null).map(() => [])
  
  for (let i = 0; i < cardsPerPlayer; i++) {
    for (let j = 0; j < numPlayers; j++) {
      const cardIndex = i * numPlayers + j
      if (cardIndex < deck.length) {
        hands[j].push(deck[cardIndex])
      }
    }
  }
  
  return hands
}

export function sortHand(hand: Card[]): Card[] {
  const suitOrder: Record<Suit, number> = {
    spades: 4,
    hearts: 3,
    diamonds: 2,
    clubs: 1
  }
  
  return [...hand].sort((a, b) => {
    const suitDiff = suitOrder[b.suit] - suitOrder[a.suit]
    if (suitDiff !== 0) return suitDiff
    
    const rankValues = {
      '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
      'J': 11, 'Q': 12, 'K': 13, 'A': 14
    } as const
    
    return rankValues[b.rank] - rankValues[a.rank]
  })
}

export function getValidCards(hand: Card[], ledSuit: Suit | null, trumpSuit: Suit): Card[] {
  if (!ledSuit) return hand
  
  const hasLedSuit = hand.some(card => card.suit === ledSuit)
  if (!hasLedSuit) return hand
  
  return hand.filter(card => card.suit === ledSuit || card.suit === trumpSuit)
}