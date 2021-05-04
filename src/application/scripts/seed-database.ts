import { numberGeneratorService } from '../../domain/game/number-generator-service'
import { logger } from '../../infra/logger/winston-config-stream'
import { inMemoryRepository } from '../../infra/repository/in-memory-repository'

export const seedDatabase = async () => {
  logger.info('Seeding database...')
  const user = await inMemoryRepository.createUser('Tu', 'guest')
  const board = await numberGeneratorService.getRandomNumbers()
  await inMemoryRepository.createGame(user.id, board, 3)
}
