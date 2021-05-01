import { nanoid } from 'nanoid'

import { UserEntity } from '../../domain/user/user-entity'

class UserFactory {
  readonly ID_SIZE = 6

  name: string

  constructor() {
    this.name = 'Tu'
  }

  setName(name: string) {
    this.name = name
    return this
  }

  build(): UserEntity {
    return {
      name: this.name,
      id: nanoid(this.ID_SIZE),
    }
  }
}

export { UserFactory }
