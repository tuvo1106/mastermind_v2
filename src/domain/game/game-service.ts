import _ from 'lodash'

import { BadRequestError } from './../../application/errors/bad-request-error'
import { numberGeneratorService } from './number-generator-service'
import { Repository } from '../../infra/repository/respository.interface'
import { inMemoryRepository } from './../../infra/repository/in-memory-repository'
import { GameEntity, Score } from './game-entity'
import { GameStatus } from '../../application/enums/gameStatus'

class GameService {
  private repository

  constructor(repository: Repository) {
    this.repository = repository
  }

  async createGame(userId: string, difficulty: string): Promise<GameEntity> {
    const guesses = this.getNumberOfGuessesForDifficulty(difficulty)
    const numbers = await numberGeneratorService.getRandomNumbers()
    return await this.repository.createGame(userId, numbers, guesses)
  }

  async getGame(userId: string, gameId: string): Promise<GameEntity> {
    return await this.repository.getGame(userId, gameId)
  }

  async deleteGame(userId: string, gameId: string): Promise<void> {
    return await this.repository.deleteGame(userId, gameId)
  }

  async processGuess(userId: string, gameId: string, guess: number[]) {
    const game = await this.repository.getGame(userId, gameId)
    if (game.state === GameStatus.WIN || game.state === GameStatus.LOSE) {
      throw new BadRequestError('Game is already over.')
    }
    const score = this.getCorrectPositionsAndColors(guess, game.board)
    const updatedGuessesRemaining = game.guessesRemaining - 1
    const updatedGameState = this.validateVictoryConditions(
      score,
      game.board,
      updatedGuessesRemaining
    )
    const updatedHistory = [...game.history].concat(score)
    return await this.repository.updateGame(userId, gameId, {
      history: updatedHistory,
      guessesRemaining: updatedGuessesRemaining,
      state: updatedGameState,
    })
  }

  getNumberOfGuessesForDifficulty(difficulty: string) {
    const DEFAULT_TURNS = 10
    if (!difficulty) return DEFAULT_TURNS
    const guessMap = new Map([
      ['easy', 12],
      ['normal', 10],
      ['hard', 8],
      ['test', 3],
    ])
    return guessMap.get(difficulty.toLowerCase()) || DEFAULT_TURNS
  }

  validateVictoryConditions(
    score: Score,
    board: number[],
    guessesRemaining: number
  ): GameStatus {
    if (score.correctPositions === board.length) return GameStatus.WIN
    if (guessesRemaining === 0) return GameStatus.LOSE
    return GameStatus.ACTIVE
  }

  getCorrectColors(guess: number[], board: number[]) {
    const guessCounter = _.countBy(guess)
    const boardCounter = _.countBy(board)
    const sharedKeys = _.intersection(guess, board)
    return sharedKeys.reduce((sum: number, key: number) => {
      const min: number = Math.min(guessCounter[key], boardCounter[key])
      return sum + min
    }, 0)
  }

  getCorrectPositionsAndColors(guess: number[], board: number[]): Score {
    if (guess.length !== board.length) {
      throw new BadRequestError('Guess length and board length do not match.')
    }
    let correctPositions = 0
    let correctColors = this.getCorrectColors(guess, board)
    for (let i = 0; i < board.length; i++) {
      if (guess[i] === board[i]) {
        correctPositions++
        correctColors--
      }
    }
    return {
      correctColors,
      correctPositions,
    }
  }
}

const gameService = new GameService(inMemoryRepository)

export { gameService }
