import { Card } from './Card'

export type PlayerPosition = 'north' | 'east' | 'south' | 'west'
export type PlayerType = 'human' | 'ai'
// Team play removed for solo scoring; keep position-only players

export interface Player {
  id: string
  name: string
  position: PlayerPosition
  type: PlayerType
  hand: Card[]
  bid: number | null
  tricksWon: number
}

export const POSITIONS: PlayerPosition[] = ['north', 'east', 'south', 'west']
// No team mapping needed in solo mode

export function createPlayer(
  position: PlayerPosition,
  type: PlayerType = 'ai',
  name?: string
): Player {
  const defaultNames = {
    north: 'North',
    east: 'East',
    south: 'You',
    west: 'West'
  }

  return {
    id: position,
    name: name || defaultNames[position],
    position,
    type,
    hand: [],
    bid: null,
    tricksWon: 0
  }
}

export function getNextPosition(currentPosition: PlayerPosition): PlayerPosition {
  const currentIndex = POSITIONS.indexOf(currentPosition)
  return POSITIONS[(currentIndex + 1) % POSITIONS.length]
}

export function getPartnerPosition(position: PlayerPosition): PlayerPosition {
  // Partner concept removed in solo mode; keep clockwise flow helper if needed
  return position
}
