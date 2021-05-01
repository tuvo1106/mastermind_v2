import { UserEntity } from '../../domain/user/user-entity'

export abstract class Repository {
  abstract createUser(name: string): Promise<UserEntity>

  abstract getUser(userId: string): Promise<UserEntity>

  abstract deleteUser(userId: string): void

  abstract updateUser(
    userId: string,
    params: { name: string }
  ): Promise<UserEntity>
}
