import { BadRequestError } from './../../application/errors/bad-request-error'
import { Repository } from '../../infra/repository/respository.interface'
import { inMemoryRepository } from './../../infra/repository/in-memory-repository'
import { UserEntity } from './user-entity'
import { userParamsValidatorService } from './user-params-validator-service'
import { logger } from '../../infra/logger/winston-config-stream'

class UserService {
  private repository
  private validator

  constructor(repository: Repository) {
    this.repository = repository
    this.validator = userParamsValidatorService
  }

  async createUser(name: string, password: string): Promise<UserEntity> {
    this.validator.validateUser(name, password)
    return await this.repository.createUser(name, password)
  }

  async signInUser(name: string, password: string): Promise<UserEntity> {
    userParamsValidatorService.validateUser(name, password)
    const user = await this.repository.getUserByName(name)
    if (user.password === password) {
      return user
    }
    logger.error(`Invalid credentials - name: ${name}, password: ${password}`)
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
    this.validator.validateNonEmptyUser(params.name, params.password)
    return await this.repository.updateUser(userId, params)
  }
}

const userService = new UserService(inMemoryRepository)

export { userService }
