import { Player } from '../types/Player'
import { RoundScore } from '../types/GameState'

// Solo scoring: each player’s score is independent, returned per seat
export function calculateRoundScore(players: Player[]): RoundScore {
  const byPos = {
    north: players.find(p => p.position === 'north'),
    east: players.find(p => p.position === 'east'),
    south: players.find(p => p.position === 'south'),
    west: players.find(p => p.position === 'west')
  }

  const northBid = byPos.north?.bid ?? 0
  const northTricks = byPos.north?.tricksWon ?? 0
  const northScore = calculateSoloScore(northBid, northTricks)

  const eastBid = byPos.east?.bid ?? 0
  const eastTricks = byPos.east?.tricksWon ?? 0
  const eastScore = calculateSoloScore(eastBid, eastTricks)

  const southBid = byPos.south?.bid ?? 0
  const southTricks = byPos.south?.tricksWon ?? 0
  const southScore = calculateSoloScore(southBid, southTricks)

  const westBid = byPos.west?.bid ?? 0
  const westTricks = byPos.west?.tricksWon ?? 0
  const westScore = calculateSoloScore(westBid, westTricks)

  return { northBid, northTricks, northScore, eastBid, eastTricks, eastScore, southBid, southTricks, southScore, westBid, westTricks, westScore }
}

function calculateTeamScore(bid: number, tricks: number): number {
  if (tricks >= bid) {
    // Team made their bid
    const baseScore = bid * 10
    const overtricks = tricks - bid
    return baseScore + overtricks
  } else {
    // Team failed to make their bid
    return bid * -10
  }
}

function calculateSoloScore(bid: number, tricks: number): number {
  return calculateTeamScore(bid, tricks)
}

export function getGameWinner(team1Score: number, team2Score: number): string | null {
  if (team1Score >= 500 && team1Score > team2Score) return 'team1'
  if (team2Score >= 500 && team2Score > team1Score) return 'team2'
  return null
}

export function formatScore(score: number): string {
  return score >= 0 ? `+${score}` : `${score}`
}
