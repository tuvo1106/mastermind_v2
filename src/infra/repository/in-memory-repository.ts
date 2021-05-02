import { GameEntity } from './../../domain/game/game-entity'
import { Repository } from './respository.interface'
import { logger } from '../../infra/logger/winston-config-stream'
import { UserFactory } from '../../application/factories/user-factory'
import { NotFoundError } from '../../application/errors/not-found-error'
import { BadRequestError } from './../../application/errors/bad-request-error'
import { UserEntity } from '../../domain/user/user-entity'
import { GameFactory } from '../../application/factories/game-factory'

interface inMemoryDB {
  users: UserEntity[]
  games: GameEntity[]
}

class InMemoryRepository extends Repository {
  private db: inMemoryDB = {
    users: [],
    games: [],
  }

  constructor() {
    super()
  }

  async createUser(name: string) {
    if (this.findUserByName(name)) {
      throw new BadRequestError(`User already exists: ${name}`)
    }
    const user = new UserFactory().setName(name).build()
    this.db.users.push(user)
    logger.info(`User created: ${JSON.stringify(user)}`)
    return user
  }

  async getUser(userId: string) {
    const user = this.findUserById(userId)
    if (!user) {
      throw new NotFoundError()
    }
    logger.info(`User found: ${JSON.stringify(user)}`)
    return user
  }

  async deleteUser(userId: string) {
    const userIndex = this.findUserIndexById(userId)
    if (userIndex === -1) {
      throw new NotFoundError()
    }
    logger.info(`User deleted: ${JSON.stringify(this.db.users[userIndex])}`)
    this.db.users.splice(userIndex, 1)
  }

  async updateUser(userId: string, params: { name: string }) {
    let user = this.findUserById(userId)
    if (!user) {
      throw new NotFoundError()
    }
    user = {
      ...user,
      name: params.name,
    }
    logger.info(`User updated: ${JSON.stringify(user)}`)
    return user
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
      throw new NotFoundError()
    }
    logger.info(`Game found: ${JSON.stringify(game)}`)
    return game
  }

  async deleteGame(userId: string, gameId: string) {
    const gameIndex = this.findGameIndexById(gameId)
    if (gameIndex === -1) {
      throw new NotFoundError()
    }
    const game = this.db.games[gameIndex]
    if (game.userId !== userId) {
      throw new NotFoundError()
    }
    logger.info(`Game deleted: ${JSON.stringify(game)}`)
    this.db.games.splice(gameIndex, 1)
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
