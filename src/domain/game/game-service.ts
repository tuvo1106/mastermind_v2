import _ from 'lodash'

import { BadRequestError } from './../../application/errors/bad-request-error'
import { numberGeneratorService } from './number-generator-service'
import { Repository } from '../../infra/repository/respository.interface'
import { inMemoryRepository } from './../../infra/repository/in-memory-repository'
import { mongoRepository } from '../../infra/repository/mongo-repository'
import { GameEntity, Score } from './game-entity'
import { GameStatus } from '../../application/enums/gameStatus'
import { gameParamsValidatorService } from './game-params-validator-service'
import { userService } from '../user/user-service'

class GameService {
  private repository
  private validator

  constructor(repository: Repository) {
    this.repository = repository
    this.validator = gameParamsValidatorService
  }

  async createGame(userId: string, difficulty: string): Promise<GameEntity> {
    await userService.getUser(userId)
    this.validator.validateDifficulty(difficulty)
    const options = this.getGameOptions(difficulty)
    const [guesses, positions] = options
    const numbers = await numberGeneratorService.getRandomNumbers(
      positions,
      0,
      7
    )
    return await this.repository.createGame(userId, numbers, guesses)
  }

  async getGame(userId: string, gameId: string): Promise<GameEntity> {
    return await this.repository.getGame(userId, gameId)
  }

  async deleteGame(userId: string, gameId: string): Promise<void> {
    return await this.repository.deleteGame(userId, gameId)
  }

  async processGuess(userId: string, gameId: string, guess: number[]) {
    this.validator.validateGuess(guess)
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

  getGameOptions(difficulty: string): number[] {
    const DEFAULT_TURNS = 10
    const DEFAULT_POSITIONS = 4
    if (difficulty === undefined) {
      return [DEFAULT_TURNS, DEFAULT_POSITIONS]
    }

    /* First number in array is number of guesses, second number
     * is number of board positions.
     * TODO: Refactor into clearer data structure. */
    const options = new Map([
      ['easy', [12, 3]],
      ['normal', [10, 4]],
      ['hard', [8, 5]],
      ['test', [3, 3]],
    ])
    return (
      options.get(difficulty.toLowerCase()) || [
        DEFAULT_TURNS,
        DEFAULT_POSITIONS,
      ]
    )
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
      guess,
    }
  }
}

let gameService: GameService
if (process.env.DB === 'mongo') {
  gameService = new GameService(mongoRepository)
} else {
  gameService = new GameService(inMemoryRepository)
}

export { gameService }
