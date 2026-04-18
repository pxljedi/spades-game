import { Card as CardType, SUIT_SYMBOLS, SUIT_COLORS, getCardValue } from '../game/types/Card'

interface CardProps {
  card: CardType
  onClick?: () => void
  isSelected?: boolean
  isDisabled?: boolean
  isPlayable?: boolean
}

export default function Card({ card, onClick, isSelected, isDisabled, isPlayable = true }: CardProps) {
  const colorClass = SUIT_COLORS[card.suit]
  const suitSymbol = SUIT_SYMBOLS[card.suit]
  
  const cardClasses = [
    'card',
    colorClass,
    isSelected ? 'selected' : '',
    !isPlayable || isDisabled ? 'disabled' : ''
  ].filter(Boolean).join(' ')

  const handleClick = () => {
    if (!isDisabled && isPlayable && onClick) {
      onClick()
    }
  }

  return (
    <div className={cardClasses} onClick={handleClick}>
      <div className="card-top">
        <span>{card.rank}</span>
        <span className={`suit-${card.suit}`}></span>
      </div>
      <div className="card-center">
        <span className={`suit-${card.suit}`}></span>
      </div>
      <div className="card-bottom">
        <span>{card.rank}</span>
        <span className={`suit-${card.suit}`}></span>
      </div>
    </div>
  )
}