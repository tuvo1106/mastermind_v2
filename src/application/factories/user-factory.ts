import { nanoid } from 'nanoid'

import { UserEntity } from '../../domain/user/user-entity'

class UserFactory {
  readonly ID_SIZE = 24

  name: string = 'Tu'
  id: string = ''
  password: string = ''

  constructor() {}

  setName(name: string) {
    this.name = name
    return this
  }

  setPassword(password: string) {
    this.password = password
    return this
  }

  setId(userId: string) {
    this.id = userId
    return this
  }

  build(): UserEntity {
    return {
      name: this.name,
      password: this.password,
      id: this.id !== '' ? this.id : nanoid(this.ID_SIZE),
    }
  }
}

export { UserFactory }
