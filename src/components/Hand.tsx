import { Card as CardType } from '../game/types/Card'
import { PlayerPosition } from '../game/types/Player'
import Card from './Card'

interface HandProps {
  cards: CardType[]
  playerId: PlayerPosition
  onCardClick?: (card: CardType) => void
  selectedCard?: CardType | null
  isPlayable?: boolean
  ledSuit?: string | null
  trumpSuit?: string
}

export default function Hand({ 
  cards, 
  playerId, 
  onCardClick, 
  selectedCard, 
  isPlayable = true,
  ledSuit = null,
  trumpSuit = 'spades'
}: HandProps) {
  const isHorizontal = playerId === 'north' || playerId === 'south'
  const twoRows = playerId === 'south' && cards.length > 5
  
  return (
    <div className={`hand ${isHorizontal ? 'horizontal' : 'vertical'} ${twoRows ? 'two-rows' : ''}`}>
      {cards.map((card) => {
        const canPlay = isPlayable && canPlayCard(card, ledSuit, trumpSuit)
        
        return (
          <Card
            key={card.id}
            card={card}
            onClick={() => onCardClick?.(card)}
            isSelected={selectedCard?.id === card.id}
            isDisabled={!canPlay}
            isPlayable={isPlayable}
          />
        )
      })}
    </div>
  )
}

function canPlayCard(card: CardType, ledSuit: string | null, trumpSuit: string): boolean {
  if (!ledSuit) return true
  
  // For now, allow all cards to be played
  // We'll implement proper rule checking later
  return true
}
