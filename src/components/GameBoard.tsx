import { useState, useEffect } from 'react'
import { useGame } from '../game/context/GameContext'
import { Card as CardType } from '../game/types/Card'
import { getAIBid, getAICardToPlay } from '../game/logic/ai'
import PlayerArea from './PlayerArea'
import Card from './Card'
import './GameBoard.css'

export default function GameBoard() {
  const { state, dispatch, actions } = useGame()
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null)

  useEffect(() => {
    if (state.phase === 'setup') {
      dispatch(actions.startGame())
    } else if (state.phase === 'dealing') {
      dispatch(actions.dealCards())
    }
  }, [state.phase, dispatch, actions])

  // Handle AI bidding
  useEffect(() => {
    if (state.phase === 'bidding') {
      const currentPlayer = getCurrentPlayer()
      if (currentPlayer && currentPlayer.type === 'ai' && currentPlayer.bid === 0) {
        const aiBid = getAIBid(currentPlayer)
        setTimeout(() => {
          dispatch(actions.placeBid(state.currentPlayer, aiBid))
        }, 1000)
      }
    }
  }, [state.phase, state.currentPlayer, state.players, dispatch, actions])

  // Handle AI card playing
  useEffect(() => {
    if (state.phase === 'playing') {
      const currentPlayer = getCurrentPlayer()
      if (currentPlayer && currentPlayer.type === 'ai' && currentPlayer.hand.length > 0) {
        const aiCard = getAICardToPlay(
          currentPlayer,
          state.currentTrick,
          state.currentTrick.ledSuit,
          state.trumpSuit
        )
        
        if (aiCard) {
          setTimeout(() => {
            dispatch(actions.playCard(state.currentPlayer, aiCard))
          }, 1500)
        }
      }
    }
  }, [state.phase, state.currentPlayer, state.players, state.currentTrick, state.trumpSuit, dispatch, actions])

  const handleCardClick = (card: CardType) => {
    if (state.phase !== 'playing') return
    
    const currentPlayer = state.players.find(p => p.id === state.currentPlayer)
    if (!currentPlayer || currentPlayer.type !== 'human') return
    
    setSelectedCard(card)
    dispatch(actions.playCard(state.currentPlayer, card))
    setSelectedCard(null)
  }

  const handleNewGame = () => {
    dispatch(actions.resetGame())
    setSelectedCard(null)
  }

  const getCurrentPlayer = () => {
    return state.players.find(p => p.id === state.currentPlayer)
  }

  const getPlayerByPosition = (position: string) => {
    return state.players.find(p => p.position === position)
  }

  const renderCurrentTrick = () => {
    if (state.currentTrick.cards.length === 0) return null

    return (
      <div className="trick-area">
        <h3>Current Trick</h3>
        <div className="trick-cards">
          {state.currentTrick.cards.map(({ playerId, card }) => (
            <div key={`${playerId}-${card.id}`} className="trick-card">
              <Card card={card} />
              <span className="player-label">{playerId}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderBiddingInterface = () => {
    if (state.phase !== 'bidding') return null
    
    const currentPlayer = getCurrentPlayer()
    if (!currentPlayer || currentPlayer.type !== 'human') return null

    return (
      <div className="bidding-interface">
        <h3>Place Your Bid</h3>
        <p>How many tricks do you think you can win?</p>
        <div className="bid-buttons">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(bid => (
            <button
              key={bid}
              onClick={() => dispatch(actions.placeBid(state.currentPlayer, bid))}
              className="bid-button"
            >
              {bid}
            </button>
          ))}
        </div>
      </div>
    )
  }

  const northPlayer = getPlayerByPosition('north')
  const eastPlayer = getPlayerByPosition('east')
  const southPlayer = getPlayerByPosition('south')
  const westPlayer = getPlayerByPosition('west')

  return (
    <div className="game-container">
      <div className="game-controls">
        <button onClick={handleNewGame} className="control-button">
          New Game
        </button>
        <div className="score-display">
          <span>North: {state.playerScores.north}</span>
          <span>East: {state.playerScores.east}</span>
          <span>South: {state.playerScores.south}</span>
          <span>West: {state.playerScores.west}</span>
        </div>
      </div>

      <div className="game-board two-column">
        <div className="left-column">
          {northPlayer && (
            <PlayerArea
              player={northPlayer}
              isCurrentPlayer={state.currentPlayer === 'north'}
            />
          )}

          {westPlayer && (
            <PlayerArea
              player={westPlayer}
              isCurrentPlayer={state.currentPlayer === 'west'}
            />
          )}

          {eastPlayer && (
            <PlayerArea
              player={eastPlayer}
              isCurrentPlayer={state.currentPlayer === 'east'}
            />
          )}
        </div>

        <div className="right-column">
          <div className="center-area">
            {renderCurrentTrick()}
            {renderBiddingInterface()}
            
            {state.phase === 'playing' && (
              <div className="game-status">
                <p>Round: {state.roundNumber}</p>
                <p>Current Player: {state.currentPlayer}</p>
                <p>Tricks Played: {state.totalTricksThisRound}/13</p>
              </div>
            )}
          </div>

          {southPlayer && (
            <PlayerArea
              player={southPlayer}
              onCardClick={handleCardClick}
              selectedCard={selectedCard}
              isCurrentPlayer={state.currentPlayer === 'south'}
              isPlayable={state.phase === 'playing'}
              ledSuit={state.currentTrick.ledSuit}
              trumpSuit={state.trumpSuit}
            />
          )}
        </div>
      </div>
    </div>
  )
}
