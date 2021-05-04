import request from 'supertest'

import app from '../../../app'
import { GameStatus } from '../../../application/enums/gameStatus'
import { inMemoryRepository } from '../../../infra/repository/in-memory-repository'

const createUser = async (
  name: string = 'Tu',
  password: string = 'password'
) => {
  const res = await request(app)
    .post('/api/v1/users')
    .send({
      name,
      password,
    })
    .expect(201)
  return res.body.id
}

const createGame = (userId: string, params: any) => {
  return request(app)
    .post(`/api/v1/users/${userId}/games`)
    .send({ ...params })
    .expect(201)
}

const createIncorrectGuess = (board: number[]) => {
  return board.map((num) => {
    if (num === 9) return 0
    return num + 1
  })
}

describe('game', () => {
  let userId: string

  beforeEach(async () => {
    inMemoryRepository.flush()
    userId = await createUser()
  })

  it('returns a 201 if a new game is able to be created', async () => {
    const res = await createGame(userId, {})

    expect(res.body.id).toBeDefined()
    expect(res.body.createdAt).toBeDefined()
    expect(res.body.state).toEqual(GameStatus.ACTIVE)
    expect(res.body.userId).toEqual(userId)

    const { totalGuesses, guessesRemaining, board, history } = res.body
    expect(totalGuesses).toBeDefined()
    expect(totalGuesses).toBeGreaterThan(0)
    expect(guessesRemaining).toBeDefined()
    expect(guessesRemaining).toBeGreaterThan(0)
    expect(board).toBeDefined()
    expect(board.length).toBeGreaterThan(0)
    expect(history).toBeDefined()
    expect(history.length).toEqual(0)
  })

  it('returns a a new game with the correct amount of guesses if a `easy` difficulty is selected', async () => {
    const res = await createGame(userId, { difficulty: 'easy' })

    const { totalGuesses } = res.body
    expect(totalGuesses).toBeDefined()
    expect(totalGuesses).toEqual(12)
  })

  it('returns a a new game with the correct amount of guesses if a `hard` difficulty is selected', async () => {
    const res = await createGame(userId, { difficulty: 'hard' })

    const { totalGuesses } = res.body
    expect(totalGuesses).toBeDefined()
    expect(totalGuesses).toEqual(8)
  })

  it('ignores capitalization for difficulty', async () => {
    const res = await createGame(userId, { difficulty: 'HARD' })

    const { totalGuesses } = res.body
    expect(totalGuesses).toBeDefined()
    expect(totalGuesses).toEqual(8)
  })

  it('returns a new game with a default number of guesses if difficulty is an unknown string', async () => {
    const res = await createGame(userId, { difficulty: 'unknown' })

    const { totalGuesses } = res.body
    expect(totalGuesses).toBeDefined()
    expect(totalGuesses).toEqual(10)
  })

  it('returns a 400 if difficulty is not a string', async () => {
    const res = await request(app)
      .post('/api/v1/users/:userId/games')
      .send({ difficulty: 3 })
      .expect(400)

    expect(res.body.errors[0].message).toEqual('Difficulty must be a string.')
  })

  it('returns a game if the game and user exists', async () => {
    let res = await createGame(userId, {})
    const gameId = res.body.id

    res = await request(app)
      .get(`/api/v1/users/${userId}/games/${gameId}`)
      .expect(200)

    expect(res.body.id).toEqual(gameId)
    expect(res.body.userId).toEqual(userId)
  })

  it('returns a 404 if the user does not exist on GET', async () => {
    let res = await createGame(userId, {})
    const gameId = res.body.id

    userId = 'invalid_id'

    res = await request(app)
      .get(`/api/v1/users/${userId}/games/${gameId}`)
      .expect(404)

    expect(res.body.errors[0].message).toEqual('Route not found.')
  })

  it('returns a 404 if the game does not exist on GET', async () => {
    const gameId = 'invalid_id'

    const res = await request(app)
      .get(`/api/v1/users/${userId}/games/${gameId}`)
      .expect(404)

    expect(res.body.errors[0].message).toEqual('Route not found.')
  })

  it('returns a 204 if a valid game is deleted', async () => {
    let res = await createGame(userId, {})
    const gameId = res.body.id

    await request(app)
      .delete(`/api/v1/users/${userId}/games/${gameId}`)
      .expect(204)

    await request(app)
      .get(`/api/v1/users/${userId}/games/${gameId}`)
      .expect(404)
  })

  it('returns a 404 if a game does not exist on DELETE', async () => {
    const gameId = 'invalid_id'

    const res = await request(app)
      .delete(`/api/v1/users/${userId}/games/${gameId}`)
      .expect(404)

    expect(res.body.errors[0].message).toEqual('Route not found.')
  })

  it('returns a 404 if a user is not associated with a game on DELETE', async () => {
    let res = await createGame(userId, {})
    const gameId = res.body.id

    userId = 'invalid_id'

    res = await request(app)
      .delete(`/api/v1/users/${userId}/games/${gameId}`)
      .expect(404)

    expect(res.body.errors[0].message).toEqual('Route not found.')
  })

  it('returns correct info about a game after a winning guess is submitted', async () => {
    let res = await createGame(userId, { difficulty: 'test' })
    const { id, board, totalGuesses } = res.body

    res = await request(app)
      .post(`/api/v1/users/${userId}/games/${id}/guess`)
      .send({
        guess: board,
      })
      .expect(200)

    expect(res.body.guessesRemaining).toEqual(totalGuesses - 1)
    expect(res.body.history.length).toBeGreaterThan(0)
    expect(res.body.state).toEqual(GameStatus.WIN)

    // game is already over
    res = await request(app)
      .post(`/api/v1/users/${userId}/games/${id}/guess`)
      .send({
        guess: board,
      })
      .expect(400)
  })

  it('returns correct info about a game after the user uses all their available guesses', async () => {
    let res = await createGame(userId, { difficulty: 'test' })
    const { id, board, totalGuesses } = res.body
    const incorrectGuess = createIncorrectGuess(board)

    for (let i = 0; i < totalGuesses; i++) {
      res = await request(app)
        .post(`/api/v1/users/${userId}/games/${id}/guess`)
        .send({
          guess: incorrectGuess,
        })
        .expect(200)
    }

    expect(res.body.guessesRemaining).toEqual(0)
    expect(res.body.history.length).toEqual(3)
    expect(res.body.state).toEqual(GameStatus.LOSE)

    // game is already over
    res = await request(app)
      .post(`/api/v1/users/${userId}/games/${id}/guess`)
      .send({
        guess: incorrectGuess,
      })
      .expect(400)
  })

  it('returns a 400 if the guess length is invalid', async () => {
    let res = await createGame(userId, {})
    const { id } = res.body

    res = await request(app)
      .post(`/api/v1/users/${userId}/games/${id}/guess`)
      .send({
        guess: [1, 2, 3],
      })
      .expect(400)

    expect(res.body.errors[0].message).toEqual(
      'Guess length and board length do not match.'
    )
  })

  it('returns a 400 if the guess is empty', async () => {
    let res = await createGame(userId, {})
    const { id } = res.body

    res = await request(app)
      .post(`/api/v1/users/${userId}/games/${id}/guess`)
      .send({
        guess: [],
      })
      .expect(400)

    expect(res.body.errors[0].message).toEqual('Guess cannot be empty.')
  })

  it('returns a 400 if the guess has non-numeric values', async () => {
    let res = await createGame(userId, {})
    const { id } = res.body

    res = await request(app)
      .post(`/api/v1/users/${userId}/games/${id}/guess`)
      .send({
        guess: ['1', '2', '3', '4'],
      })
      .expect(400)

    expect(res.body.errors[0].message).toEqual('Each guess must be a number.')
  })

  it('returns a 400 if the guess has non-integer values', async () => {
    let res = await createGame(userId, {})
    const { id } = res.body

    res = await request(app)
      .post(`/api/v1/users/${userId}/games/${id}/guess`)
      .send({
        guess: [1.5, 2, 3, 4],
      })
      .expect(400)

    expect(res.body.errors[0].message).toEqual('Each guess must be an integer.')
  })
})
