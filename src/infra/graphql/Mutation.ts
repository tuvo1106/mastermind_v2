import { GameEntity } from './../../domain/game/game-entity'
import { UserEntity } from './../../domain/user/user-entity'
import { userService } from '../../domain/user/user-service'
import { gameService } from '../../domain/game/game-service'

const Mutation = {
  signIn(
    parent: any,
    args: any,
    context: { userService: any },
    info: any
  ): Promise<UserEntity> {
    const { name, password } = args.data
    return userService.signInUser(name, password)
  },
  createUser(
    parent: any,
    args: any,
    context: { userService: any },
    info: any
  ): Promise<UserEntity> {
    const { name, password } = args.data
    return userService.createUser(name, password)
  },
  deleteUser(parent: any, args: any, context: { userService: any }, info: any) {
    const { userId } = args.data
    return userService.deleteUser(userId)
  },
  updateUser(
    parent: any,
    args: any,
    context: { userService: any },
    info: any
  ): Promise<UserEntity> {
    const { userId, name, password } = args.data
    return userService.updateUser(userId, { name, password })
  },
  createGame(
    parent: any,
    args: any,
    context: { gameService: any },
    info: any
  ): Promise<GameEntity> {
    const { userId, difficulty } = args.data
    return gameService.createGame(userId, difficulty)
  },
  deleteGame(parent: any, args: any, context: { gameService: any }, info: any) {
    const { userId, gameId } = args.data
    return gameService.deleteGame(userId, gameId)
  },
  guess(
    parent: any,
    args: any,
    context: { gameService: any },
    info: any
  ): Promise<GameEntity> {
    const { userId, gameId, guess } = args.data
    return gameService.processGuess(userId, gameId, guess)
  },
}

export { Mutation }
