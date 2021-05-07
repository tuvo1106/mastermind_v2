import { Repository } from './respository.interface'
import { GameStatus } from './../../application/enums/gameStatus'
import { NotFoundError } from '../../application/errors/not-found-error'
import { BadRequestError } from './../../application/errors/bad-request-error'
import { Score } from './../../domain/game/game-entity'
import { logger } from '../../infra/logger/winston-config-stream'

import { User } from './mongo/models/user'
import { Game } from './mongo/models/game'

class MongoRepository extends Repository {
  constructor() {
    super()
  }

  async createUser(name: string, password: string) {
    const existingUser = await User.findOne({ name })
    if (existingUser) {
      logger.error(`User already exists: ${name}`)
      throw new BadRequestError(`User already exists: ${name}`)
    }

    const user = User.build({ name, password })
    await user.save()

    logger.info(`User created: ${JSON.stringify(user)}`)
    return user
  }

  async getUser(userId: string) {
    const user = await User.findById(userId)
    if (user == null) {
      logger.error(`UserId not found: ${userId}`)
      throw new NotFoundError()
    }
    logger.info(`User found: ${JSON.stringify(user)}`)
    return user
  }

  async getUserByName(name: string) {
    const user = await User.findOne({ name })
    if (!user) {
      logger.error(`User not found: ${name}`)
      throw new BadRequestError(`User not found: ${name}`)
    }
    return user
  }

  async deleteUser(userId: string) {
    const user = await User.findByIdAndDelete(userId)
    if (!user) {
      logger.error(`UserId not found: ${userId}`)
      throw new NotFoundError()
    }
    logger.info(`User deleted: ${JSON.stringify(user)}`)
    const games = await Game.find({
      userId: userId,
    })
    games.forEach((game) => {
      this.deleteGame(userId, game.id)
    })
  }

  async updateUser(userId: string, params: { name: string; password: string }) {
    const user = await User.findById(userId)
    if (user === null) {
      logger.error(`UserId ${userId} not found.`)
      throw new NotFoundError()
    }
    const updatedName = params.name !== undefined ? params.name : user?.name
    const updatedPassword =
      params.password !== undefined ? params.password : user.password
    const updatedUser = {
      id: user.id,
      name: updatedName,
      password: updatedPassword,
    }
    await user.replaceOne(updatedUser)
    logger.info(`User updated: ${JSON.stringify(updatedUser)}`)
    return updatedUser
  }

  async createGame(userId: string, board: number[], guesses: number) {
    const game = await Game.build({
      createdAt: new Date(),
      state: GameStatus.ACTIVE,
      totalGuesses: guesses,
      guessesRemaining: guesses,
      board,
      history: [],
      userId,
    })
    await game.save()
    logger.info(`Game created: ${JSON.stringify(game)}`)
    return game
  }

  async getGame(userId: string, gameId: string) {
    const game = await Game.findById(gameId)
    if (!game || game.userId !== userId) {
      logger.error(
        `Game not found with: {userId: ${userId}, gameId: ${gameId}}`
      )
      throw new NotFoundError()
    }
    logger.info(`Game found: ${JSON.stringify(game)}`)
    return game
  }

  async deleteGame(userId: string, gameId: string) {
    const game = await Game.findByIdAndDelete(gameId)
    if (!game || game.userId !== userId) {
      logger.error(
        `Game not found with: {userId: ${userId}, gameId: ${gameId}}`
      )
      throw new NotFoundError()
    }
    logger.info(`Game deleted: ${JSON.stringify(game)}`)
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
    const game = await Game.findById(gameId)
    if (!game || game.userId !== userId) {
      logger.error(
        `Game not found with: {userId: ${userId}, gameId: ${gameId}}`
      )
      throw new NotFoundError()
    }
    const updatedGame = {
      id: game.id,
      createdAt: game.createdAt,
      state: params.state,
      totalGuesses: game.totalGuesses,
      guessesRemaining: params.guessesRemaining,
      board: game.board,
      history: params.history,
      userId,
    }
    await game.replaceOne(updatedGame)
    logger.info(`Game updated: ${JSON.stringify(updatedGame)}`)
    return updatedGame
  }
}

const mongoRepository = new MongoRepository()

export { mongoRepository }
