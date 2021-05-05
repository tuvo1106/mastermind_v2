import { BadRequestError } from '../../application/errors/bad-request-error'

class GameParamsValidatorService {
  constructor() {}

  validateDifficulty(difficulty: any): boolean {
    if (difficulty === undefined || typeof difficulty === 'string') {
      return true
    }
    throw new BadRequestError('Difficulty must be a string.')
  }

  validateGuess(guess: any): boolean {
    if (!Array.isArray(guess)) {
      throw new BadRequestError('Guess must be an array.')
    }
    if (guess.length === 0) {
      throw new BadRequestError('Guess cannot be empty.')
    }
    guess.forEach((el) => {
      if (typeof el !== 'number')
        throw new BadRequestError('Each guess must be a number.')
      if (!Number.isInteger(el))
        throw new BadRequestError('Each guess must be an integer.')
    })

    return true
  }
}

const gameParamsValidatorService = new GameParamsValidatorService()

export { gameParamsValidatorService }
