import { GameStatus } from '../../application/enums/gameStatus'

export interface Score {
  guess: number[]
  correctColors: number
  correctPositions: number
}

export interface GameEntity {
  id: string
  createdAt: Date
  state: GameStatus
  totalGuesses: number
  guessesRemaining: number
  board: number[]
  history: Score[]
  userId: string
}
