import { Repository } from './respository.interface'
import { logger } from '../../infra/logger/winston-config-stream'
import { UserFactory } from '../../application/factories/user-factory'
import { NotFoundError } from '../../application/errors/not-found-error'
import { BadRequestError } from './../../application/errors/bad-request-error'
import { UserEntity } from '../../domain/user/user-entity'

interface inMemoryDB {
  users: UserEntity[]
}

class InMemoryRepository extends Repository {
  private db: inMemoryDB = {
    users: [],
  }

  constructor() {
    super()
  }

  async createUser(name: string) {
    if (this.findUserByName(name)) {
      throw new BadRequestError(`User already exists: ${name}`)
    }
    const user = new UserFactory().setName(name).build()
    this.db.users.push(user)
    logger.info(`User created: ${JSON.stringify(user)}`)
    return user
  }

  async getUser(userId: string) {
    const user = this.findUserById(userId)
    if (!user) {
      throw new NotFoundError()
    }
    logger.info(`User found: ${JSON.stringify(user)}`)
    return user
  }

  async deleteUser(userId: string) {
    const userIndex = this.findUserIndexById(userId)
    if (userIndex === -1) {
      throw new NotFoundError()
    }
    logger.info(`User deleted: ${JSON.stringify(this.db.users[userIndex])}`)
    this.db.users.splice(userIndex, 1)
  }

  async updateUser(userId: string, params: { name: string }) {
    let user = this.findUserById(userId)
    if (!user) {
      throw new NotFoundError()
    }
    user = {
      ...user,
      name: params.name,
    }
    logger.info(`User updated: ${JSON.stringify(user)}`)
    return user
  }

  flush() {
    this.db = {
      users: [],
    }
  }

  private findUserByName(name: string): UserEntity | undefined {
    return this.db.users.find((user) => user.name === name)
  }

  private findUserById(userId: string): UserEntity | undefined {
    return this.db.users.find((user) => user.id === userId)
  }

  private findUserIndexById(userId: string): number {
    return this.db.users.map((user) => user.id).indexOf(userId)
  }
}

const inMemoryRepository = new InMemoryRepository()

export { inMemoryRepository }
