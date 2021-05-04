import { BadRequestError } from './../../application/errors/bad-request-error'
import { Repository } from '../../infra/repository/respository.interface'
import { inMemoryRepository } from './../../infra/repository/in-memory-repository'
import { UserEntity } from './user-entity'

class UserService {
  private repository

  constructor(repository: Repository) {
    this.repository = repository
  }

  async createUser(name: string, password: string): Promise<UserEntity> {
    return await this.repository.createUser(name, password)
  }

  async signInUser(name: string, password: string): Promise<UserEntity> {
    const user = await this.repository.getUserByName(name)
    if (user.password === password) {
      return user
    }
    throw new BadRequestError('Invalid credentials.')
  }

  async getUser(userId: string): Promise<UserEntity> {
    return await this.repository.getUser(userId)
  }

  async deleteUser(userId: string): Promise<void> {
    return await this.repository.deleteUser(userId)
  }

  async updateUser(
    userId: string,
    params: { name: string; password: string }
  ): Promise<UserEntity> {
    return await this.repository.updateUser(userId, params)
  }
}

const userService = new UserService(inMemoryRepository)

export { userService }
