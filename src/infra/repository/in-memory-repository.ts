import { Repository } from './respository.interface'
import { GameStatus } from './../../application/enums/gameStatus'
import { UserFactory } from '../../application/factories/user-factory'
import { NotFoundError } from '../../application/errors/not-found-error'
import { BadRequestError } from './../../application/errors/bad-request-error'
import { GameFactory } from '../../application/factories/game-factory'
import { UserEntity } from '../../domain/user/user-entity'
import { GameEntity, Score } from './../../domain/game/game-entity'
import { logger } from '../../infra/logger/winston-config-stream'

interface inMemoryDatabase {
  users: UserEntity[]
  games: GameEntity[]
}

class InMemoryRepository extends Repository {
  private db: inMemoryDatabase = {
    users: [],
    games: [],
  }

  constructor() {
    super()
  }

  async createUser(name: string, password: string, userId: string = '') {
    if (this.findUserByName(name)) {
      logger.error(`User already exists: ${name}`)
      throw new BadRequestError(`User already exists: ${name}`)
    }
    const user = new UserFactory()
      .setName(name)
      .setId(userId)
      .setPassword(password)
      .build()
    this.db.users.push(user)
    logger.info(`User created: ${JSON.stringify(user)}`)
    return user
  }

  async getUser(userId: string) {
    const user = this.findUserById(userId)
    if (!user) {
      logger.error(`UserId not found: ${userId}`)
      throw new NotFoundError()
    }
    logger.info(`User found: ${JSON.stringify(user)}`)
    return user
  }

  async getUserByName(name: string) {
    const user = this.findUserByName(name)
    if (user === undefined) {
      logger.error(`User not found: ${name}`)
      throw new BadRequestError(`User not found: ${name}`)
    }
    return user
  }

  async deleteUser(userId: string) {
    const userIndex = this.findUserIndexById(userId)
    if (userIndex === -1) {
      logger.error(`UserId not found: ${userId}`)
      throw new NotFoundError()
    }
    logger.info(`User deleted: ${JSON.stringify(this.db.users[userIndex])}`)
    this.db.users.splice(userIndex, 1)
  }

  async updateUser(userId: string, params: { name: string; password: string }) {
    const userIndex = this.findUserIndexById(userId)
    if (userIndex == -1) {
      logger.error(`UserId ${userId} not found.`)
      throw new NotFoundError()
    }
    const user = this.db.users[userIndex]
    const updatedName = params.name !== undefined ? params.name : user.name
    const updatedPassword =
      params.password !== undefined ? params.password : user.password
    const updatedUser = {
      ...user,
      name: updatedName,
      password: updatedPassword,
    }
    this.db.users.splice(userIndex, 1, updatedUser)
    logger.info(`User updated: ${JSON.stringify(updatedUser)}`)
    return updatedUser
  }

  async createGame(userId: string, board: number[], guesses: number) {
    const game = new GameFactory()
      .setBoard(board)
      .setTotalGuesses(guesses)
      .setUserId(userId)
      .build()
    logger.info(`Game created: ${JSON.stringify(game)}`)
    this.db.games.push(game)
    return game
  }

  async getGame(userId: string, gameId: string) {
    const game = this.findGameByIds(userId, gameId)
    if (!game) {
      logger.error(
        `Game not found with: {userId: ${userId}, gameId: ${gameId}}`
      )
      throw new NotFoundError()
    }
    logger.info(`Game found: ${JSON.stringify(game)}`)
    return game
  }

  async deleteGame(userId: string, gameId: string) {
    const gameIndex = this.findGameIndexById(gameId)
    if (gameIndex === -1) {
      logger.error(`Game not found: ${gameId}`)
      throw new NotFoundError()
    }
    const game = this.db.games[gameIndex]
    if (game.userId !== userId) {
      logger.error(
        `Game not found with: {userId: ${userId}, gameId: ${gameId}}`
      )
      throw new NotFoundError()
    }
    logger.info(`Game deleted: ${JSON.stringify(game)}`)
    this.db.games.splice(gameIndex, 1)
  }

  async updateGame(
    userId: string,
    gameId: string,
    params: {
      history: Score[]
      guessesRemaining: number
      state: GameStatus
    }
  ) {
    const gameIndex = this.findGameIndexById(gameId)
    const game = this.db.games[gameIndex]
    const updatedGame = {
      ...game,
      history: params.history,
      guessesRemaining: params.guessesRemaining,
      state: params.state,
    }
    this.db.games.splice(gameIndex, 1, updatedGame)
    logger.info(`Game updated: ${JSON.stringify(updatedGame)}`)
    return updatedGame
  }

  flush() {
    this.db = {
      users: [],
      games: [],
    }
  }

  private findUserByName(name: string): UserEntity | undefined {
    return this.db.users.find((user) => user.name === name)
  }

  private findUserById(userId: string): UserEntity | undefined {
    return this.db.users.find((user) => user.id === userId)
  }

  private findUserIndexById(userId: string): number {
    return this.db.users.map((user) => user.id).indexOf(userId)
  }

  private findGameByIds(
    userId: string,
    gameId: string
  ): GameEntity | undefined {
    return this.db.games.find(
      (game) => game.id === gameId && game.userId === userId
    )
  }

  private findGameIndexById(gameId: string): number {
    return this.db.games.map((game) => game.id).indexOf(gameId)
  }
}

const inMemoryRepository = new InMemoryRepository()

export { inMemoryRepository }
