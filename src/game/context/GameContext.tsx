import React, { createContext, useContext, useReducer, ReactNode } from 'react'
import { GameState } from '../types/GameState'
import { gameReducer } from '../logic/gameReducer'
import { GameAction, gameActions } from '../types/GameActions'
import { createInitialGameState } from '../types/GameState'

interface GameContextType {
  state: GameState
  dispatch: React.Dispatch<GameAction>
  actions: typeof gameActions
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, createInitialGameState())
  
  return (
    <GameContext.Provider value={{ state, dispatch, actions: gameActions }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}