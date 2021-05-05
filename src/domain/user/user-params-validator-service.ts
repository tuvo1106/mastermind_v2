import { BadRequestError } from '../../application/errors/bad-request-error'

class UserParamsValidatorService {
  constructor() {}

  validateUser(name: String, password: String): boolean {
    if (name === undefined) throw new BadRequestError('Name is required.')
    if (name === '')
      throw new BadRequestError('Name cannot be an empty string.')
    if (password === undefined)
      throw new BadRequestError('Password is required.')
    if (password === '')
      throw new BadRequestError('Password cannot be an empty string.')
    return true
  }

  validateNonEmptyUser(name: String, password: String): boolean {
    if (name === '')
      throw new BadRequestError('Name cannot be an empty string.')
    if (password === '')
      throw new BadRequestError('Password cannot be an empty string.')
    return true
  }
}

const userParamsValidatorService = new UserParamsValidatorService()

export { userParamsValidatorService }
