import { Player } from '../game/types/Player'
import { Card as CardType } from '../game/types/Card'
import Hand from './Hand'

interface PlayerAreaProps {
  player: Player
  onCardClick?: (card: CardType) => void
  selectedCard?: CardType | null
  isCurrentPlayer?: boolean
  isPlayable?: boolean
  ledSuit?: string | null
  trumpSuit?: string
}

export default function PlayerArea({ 
  player, 
  onCardClick, 
  selectedCard, 
  isCurrentPlayer = false,
  isPlayable = false,
  ledSuit,
  trumpSuit
}: PlayerAreaProps) {
  const getPlayerAreaClass = () => {
    const baseClass = 'player-area'
    const positionClass = player.position
    const currentClass = isCurrentPlayer ? 'current-player' : ''
    
    return [baseClass, positionClass, currentClass].filter(Boolean).join(' ')
  }

  return (
    <div className={getPlayerAreaClass()}>
      <div className="player-info">
        <h3>{player.name}</h3>
        <div className="player-stats">
          <span>Bid: {player.bid}</span>
          <span>Tricks: {player.tricksWon}</span>
        </div>
        {isCurrentPlayer && <div className="current-turn-indicator">Your Turn</div>}
      </div>
      
      {player.type === 'human' && (
        <Hand
          cards={player.hand}
          playerId={player.position}
          onCardClick={onCardClick}
          selectedCard={selectedCard}
          isPlayable={isPlayable}
          ledSuit={ledSuit}
          trumpSuit={trumpSuit}
        />
      )}
    </div>
  )
}