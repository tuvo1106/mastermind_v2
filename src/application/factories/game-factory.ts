import { nanoid } from 'nanoid'
import { GameStatus } from '../enums/gameStatus'

import { GameEntity, Score } from './../../domain/game/game-entity'

class GameFactory {
  readonly ID_SIZE = 6

  totalGuesses: number
  board: number[]
  history: Score[]
  userId: string

  constructor() {
    this.totalGuesses = 0
    this.board = []
    this.history = []
    this.userId = ''
  }

  setTotalGuesses(totalGuesses: number) {
    this.totalGuesses = totalGuesses
    return this
  }

  setBoard(board: number[]) {
    this.board = board
    return this
  }

  setGuesses(guesses: number) {
    this.totalGuesses = guesses
    return this
  }

  setUserId(userId: string) {
    this.userId = userId
    return this
  }

  build(): GameEntity {
    return {
      id: nanoid(this.ID_SIZE),
      createdAt: new Date(),
      state: GameStatus.ACTIVE,
      totalGuesses: this.totalGuesses,
      guessesRemaining: this.totalGuesses,
      board: this.board,
      history: this.history,
      userId: this.userId,
    }
  }
}

export { GameFactory }
