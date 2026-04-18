import { useState } from 'react'
import { GameProvider } from './game/context/GameContext'
import GameBoard from './components/GameBoard'
import './App.css'

function App() {
  const [gameStarted, setGameStarted] = useState(false)

  const startNewGame = () => {
    setGameStarted(true)
  }

  return (
    <div className="app">
      <h1>Spades Game</h1>
      {!gameStarted ? (
        <div className="start-screen">
          <h2>Welcome to Spades!</h2>
          <p>A classic 4-player trick-taking card game</p>
          <button onClick={startNewGame} className="start-button">
            Start New Game
          </button>
        </div>
      ) : (
        <GameProvider>
          <GameBoard />
        </GameProvider>
      )}
    </div>
  )
}

export default App