import { UserEntity } from './../../domain/user/user-entity'
import { userService } from '../../domain/user/user-service'
import { healthCheckService } from '../../domain/health-check/health-check-service'
import { gameService } from '../../domain/game/game-service'
import { GameEntity } from '../../domain/game/game-entity'

const Query = {
  ping() {
    return healthCheckService.getAppHealth()
  },
  async getUser(
    parent: any,
    args: any,
    context: { userService: any },
    info: any
  ): Promise<UserEntity> {
    const { userId } = args
    return await userService.getUser(userId)
  },
  async getGame(
    parent: any,
    args: any,
    context: { gameService: any },
    info: any
  ): Promise<GameEntity> {
    const { userId, gameId } = args
    return await gameService.getGame(userId, gameId)
  },
}

export { Query }
