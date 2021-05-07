import { BadRequestError } from './../../application/errors/bad-request-error'
import { Repository } from '../../infra/repository/respository.interface'
import { inMemoryRepository } from './../../infra/repository/in-memory-repository'
import { mongoRepository } from '../../infra/repository/mongo-repository'
import { UserEntity } from './user-entity'
import { userParamsValidatorService } from './user-params-validator-service'
import { logger } from '../../infra/logger/winston-config-stream'
import { authService } from './auth-service'

class UserService {
  private repository
  private validator

  constructor(repository: Repository) {
    this.repository = repository
    this.validator = userParamsValidatorService
  }

  async createUser(name: string, password: string): Promise<UserEntity> {
    this.validator.validateUser(name, password)
    const hashedPassword = await authService.hashPassword(password)
    return await this.repository.createUser(name, hashedPassword)
  }

  async signInUser(name: string, password: string): Promise<UserEntity> {
    userParamsValidatorService.validateUser(name, password)
    const user = await this.repository.getUserByName(name)
    const validPassword = await authService.validatePassword(
      password,
      user.password
    )
    if (validPassword) {
      return user
    }
    logger.error(`Invalid credentials - name: ${name}, password: ${password}`)
    throw new BadRequestError('Invalid credentials.')
  }

  async getUser(userId: string): Promise<UserEntity | null> {
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
    const hashedPassword =
      params.password !== undefined
        ? await authService.hashPassword(params.password)
        : params.password
    return await this.repository.updateUser(userId, {
      name: params.name,
      password: hashedPassword,
    })
  }
}

let userService: UserService
if (process.env.DB === 'mongo') {
  userService = new UserService(mongoRepository)
} else {
  userService = new UserService(inMemoryRepository)
}

export { userService }
