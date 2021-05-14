import { GameStatus } from '../../../application/enums/gameStatus'
import { Score } from '../game-entity'
import { BadRequestError } from '../../../application/errors/bad-request-error'
import { gameService } from '../game-service'

describe('gameService', () => {
  it('throws an error if guess length and board length do not match', () => {
    const guess = [1, 2, 3]
    const board = [1, 2, 3, 4]

    try {
      gameService.getCorrectPositionsAndColors(guess, board)
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestError)
    }
  })

  it('validates a guess with the correct response', () => {
    const guess = [1, 2, 3, 4]
    const board = [1, 2, 3, 4]
    const res = gameService.getCorrectPositionsAndColors(guess, board)

    expect(res).toEqual({
      correctColors: 0,
      correctPositions: 4,
      guess,
    })
  })

  it('validates a guess with the all incorrect colors and incorrect positions', () => {
    const guess = [1, 2, 3, 4]
    const board = [5, 6, 7, 8]
    const res = gameService.getCorrectPositionsAndColors(guess, board)

    expect(res).toEqual({ correctColors: 0, correctPositions: 0, guess })
  })

  it('validates a guess with a correct color, but incorrect positions', () => {
    const guess = [1, 2, 3, 4]
    const board = [4, 5, 6, 7]
    const res = gameService.getCorrectPositionsAndColors(guess, board)

    expect(res).toEqual({ correctColors: 1, correctPositions: 0, guess })
  })

  it('validates a guess with multiple correct colors/positions but incorrect colors in other positions', () => {
    const guess = [2, 2, 2, 2]
    const board = [5, 2, 2, 5]
    const res = gameService.getCorrectPositionsAndColors(guess, board)

    expect(res).toEqual({ correctColors: 0, correctPositions: 2, guess })
  })

  it('validates a guess with the all correct colors, but in all the wrong positions', () => {
    const guess = [1, 2, 3, 4]
    const board = [4, 3, 2, 1]
    const res = gameService.getCorrectPositionsAndColors(guess, board)

    expect(res).toEqual({ correctColors: 4, correctPositions: 0, guess })
  })

  it('validates a guess with the all correct colors/positions, except one incorrect color that matches another position', () => {
    const guess = [6, 2, 1, 5]
    const board = [6, 2, 6, 5]
    const res = gameService.getCorrectPositionsAndColors(guess, board)

    expect(res).toEqual({ correctColors: 0, correctPositions: 3, guess })
  })

  it('returns the correct amount of colors guessed', () => {
    let guess = [1, 2, 3, 4]
    let board = [1, 2, 3, 4]

    let res = gameService.getCorrectColors(guess, board)
    expect(res).toEqual(4)

    guess = [1, 2, 3, 4]
    board = [5, 6, 7, 8]

    res = gameService.getCorrectColors(guess, board)
    expect(res).toEqual(0)

    guess = [2, 2, 2, 2]
    board = [1, 2, 3, 4]

    res = gameService.getCorrectColors(guess, board)
    expect(res).toEqual(1)

    guess = [2, 2, 2, 2]
    board = [2, 2, 4, 4]

    res = gameService.getCorrectColors(guess, board)
    expect(res).toEqual(2)
  })

  it('returns the correct game status', () => {
    let score: Score = {
      correctPositions: 4,
      correctColors: 0,
      guess: [1, 2, 3, 4],
    }
    let board = [1, 2, 3, 4]
    let guessesRemaining = 1

    expect(
      gameService.validateVictoryConditions(score, board, guessesRemaining)
    ).toEqual(GameStatus.WIN)

    score = {
      correctPositions: 3,
      correctColors: 0,
      guess: [1, 2, 3, 4],
    }
    board = [1, 2, 3, 4]
    guessesRemaining = 1
    expect(
      gameService.validateVictoryConditions(score, board, guessesRemaining)
    ).toEqual(GameStatus.ACTIVE)

    guessesRemaining = 0

    expect(
      gameService.validateVictoryConditions(score, board, guessesRemaining)
    ).toEqual(GameStatus.LOSE)
  })
})
