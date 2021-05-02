import { CustomValidator } from 'express-validator'

class GameParamsValidatorService {
  constructor() {}

  isValidDifficulty: CustomValidator = (value) => {
    if (value === undefined || typeof value === 'string') return true
    throw new Error('Difficulty must be a string.')
  }

  isValidGuess: CustomValidator = (value) => {
    if (!Array.isArray(value)) throw new Error('Guess must be an array.')
    if (value.length === 0) throw new Error('Guess cannot be empty.')
    value.forEach((val) => {
      if (typeof val !== 'number')
        throw new Error('Each guess must be a number.')
      if (!Number.isInteger(val))
        throw new Error('Each guess must be an integer.')
    })
    return true
  }
}

const gameParamsValidatorService = new GameParamsValidatorService()

export { gameParamsValidatorService }
