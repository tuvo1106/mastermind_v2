import { GameStatus } from './../../application/enums/gameStatus'
import { GameEntity, Score } from '../../domain/game/game-entity'
import { UserEntity } from '../../domain/user/user-entity'

export abstract class Repository {
  abstract createUser(
    name: string,
    password: string,
    userId?: string
  ): Promise<UserEntity>

  abstract getUser(userId: string): Promise<UserEntity>

  abstract getUserByName(name: string): Promise<UserEntity>

  abstract deleteUser(userId: string): void

  abstract updateUser(
    userId: string,
    params: { name?: string | undefined; password?: string | undefined }
  ): Promise<UserEntity>

  abstract createGame(
    userId: string,
    board: number[],
    guesses: number
  ): Promise<GameEntity>

  abstract getGame(userId: string, gameId: string): Promise<GameEntity>

  abstract deleteGame(userId: string, gameId: string): void

  abstract updateGame(
    userId: string,
    gameId: string,
    params: {
      history: Score[]
      guessesRemaining: number
      state: GameStatus
    }
  ): Promise<GameEntity>
}
