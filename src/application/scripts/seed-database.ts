import { GameStatus } from './../enums/gameStatus'
import { numberGeneratorService } from '../../domain/game/number-generator-service'
import { logger } from '../../infra/logger/winston-config-stream'
import { inMemoryRepository } from '../../infra/repository/in-memory-repository'
import { Game } from '../../infra/repository/mongo/models/game'
import { User } from '../../infra/repository/mongo/models/user'

export const seedDatabase = async () => {
  logger.info('Seeding database...')
  const name = 'Tu'
  const password = 'mustard'
  const board = await numberGeneratorService.getRandomNumbers()
  let user, game
  if (process.env.DB === 'mongo') {
    user = await User.build({
      name,
      password,
    })
    await user.save()
    game = await Game.build({
      createdAt: new Date(),
      state: GameStatus.ACTIVE,
      totalGuesses: 3,
      guessesRemaining: 3,
      board,
      history: [],
      userId: user.id,
    })
    await game.save()
    logger.info(`User created: ${JSON.stringify(user)}`)
    logger.info(`Game created: ${JSON.stringify(game)}`)
  } else {
    user = await inMemoryRepository.createUser(name, password, 'guest')
    game = await inMemoryRepository.createGame(user.id, board, 3)
  }
}
