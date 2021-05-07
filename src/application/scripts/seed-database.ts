import { logger } from '../../infra/logger/winston-config-stream'
import { userService } from '../../domain/user/user-service'

export const seedDatabase = async () => {
  logger.info('Seeding database...')
  const name = 'Tu'
  const password = 'guest'
  const user = await userService.createUser(name, password)
}
