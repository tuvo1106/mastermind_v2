import request from 'supertest'
import mongoose from 'mongoose'

import app from '../../../app'

const createUser = (name: string, password: string = 'password') => {
  return request(app)
    .post('/api/v1/users')
    .send({
      name,
      password,
    })
    .expect(201)
}

describe('user', () => {
  it('returns a 201 if a new user is able to be created', async () => {
    const res = await createUser('Tu', 'tacos')

    expect(res.body.name).toEqual('Tu')
    expect(res.body.password).toBeDefined()

    // password should be hashed
    expect(res.body.password).not.toEqual('tacos')
  })

  it('returns a 400 if the user already exists', async () => {
    await createUser('Tu')

    const res = await request(app).post('/api/v1/users').send({
      name: 'Tu',
      password: 'password',
    })

    expect(res.body.errors[0].message).toEqual('User already exists: Tu')
  })

  it('returns a 400 if a name or password is not provided on POST', async () => {
    const res = await request(app).post('/api/v1/users').send({}).expect(400)

    expect(res.body.errors[0].message).toEqual('Name is required.')
  })

  it('returns a 400 if a name is not provided on POST', async () => {
    const res = await request(app)
      .post('/api/v1/users')
      .send({ password: 'password' })
      .expect(400)

    expect(res.body.errors[0].message).toEqual('Name is required.')
  })

  it('returns a 400 if a password is not provided on POST', async () => {
    const res = await request(app)
      .post('/api/v1/users')
      .send({ name: 'Tu' })
      .expect(400)

    expect(res.body.errors[0].message).toEqual('Password is required.')
  })

  it('returns a 400 if a name is an empty string on POST', async () => {
    const res = await request(app)
      .post('/api/v1/users')
      .send({ name: '', password: 'password' })
      .expect(400)

    expect(res.body.errors[0].message).toEqual(
      'Name cannot be an empty string.'
    )
  })

  it('returns a 400 if a password is an empty string on POST', async () => {
    const res = await request(app)
      .post('/api/v1/users')
      .send({ name: 'Tu', password: '' })
      .expect(400)

    expect(res.body.errors[0].message).toEqual(
      'Password cannot be an empty string.'
    )
  })

  it('returns a user if that user exists', async () => {
    const name = 'Tu'
    let res = await createUser('Tu')
    const userId = res.body.id

    res = await request(app).get(`/api/v1/users/${userId}`).expect(200)

    expect(res.body.name).toBe(name)
  })

  it('returns a 404 if the user does not exist on GET', async () => {
    const invalidId = mongoose.Types.ObjectId()
    const res = await request(app).get(`/api/v1/users/${invalidId}`).expect(404)

    expect(res.body.errors[0].message).toEqual('Route not found.')
  })

  it('returns a 204 if a valid user is deleted', async () => {
    const res = await createUser('Tu')
    const userId = res.body.id

    await request(app).delete(`/api/v1/users/${userId}`).expect(204)

    await request(app).get(`/api/v1/users/${userId}`).expect(404)
  })

  it('returns a 404 if an invalid user is deleted', async () => {
    const invalidId = mongoose.Types.ObjectId()
    const res = await request(app)
      .delete(`/api/v1/users/${invalidId}`)
      .expect(404)

    expect(res.body.errors[0].message).toEqual('Route not found.')
  })

  it('returns a 200 if a valid user is updated', async () => {
    const res = await createUser('Tu')
    const userId = res.body.id

    const updated = await request(app)
      .put(`/api/v1/users/${userId}`)
      .send({ name: 'Brenda' })
      .expect(200)

    expect(updated.body.name).toEqual('Brenda')
  })

  it('does not update user with extraneous params', async () => {
    const res = await createUser('Tu')
    const userId = res.body.id

    const updated = await request(app)
      .put(`/api/v1/users/${userId}`)
      .send({ name: 'Brenda', password: 'tacos', occupation: 'developer' })
      .expect(200)

    expect(updated.body.name).toEqual('Brenda')
    expect(updated.body.occupation).not.toBeDefined()
  })

  it('returns a 404 if a user does not exist on PUT', async () => {
    const invalidId = mongoose.Types.ObjectId()
    const res = await request(app)
      .put(`/api/v1/users/${invalidId}`)
      .send({ name: 'Brenda', password: 'password' })
      .expect(404)

    expect(res.body.errors[0].message).toEqual('Route not found.')
  })

  it('returns a 400 if a name is an empty string on PUT', async () => {
    let res = await createUser('Tu')
    const userId = res.body.id

    res = await request(app)
      .put(`/api/v1/users/${userId}`)
      .send({ name: '', password: 'password' })
      .expect(400)

    expect(res.body.errors[0].message).toEqual(
      'Name cannot be an empty string.'
    )
  })

  it('returns a 400 if a password is an empty string on PUT', async () => {
    let res = await createUser('Tu')
    const userId = res.body.id

    res = await request(app)
      .put(`/api/v1/users/${userId}`)
      .send({ name: 'Brenda', password: '' })
      .expect(400)

    expect(res.body.errors[0].message).toEqual(
      'Password cannot be an empty string.'
    )
  })

  it('returns a user if a user signs in with correct credentials', async () => {
    let res = await createUser('Tu', 'tacos')
    const userId = res.body.id

    res = await request(app)
      .post(`/api/v1/users/sign-in`)
      .send({ name: 'Tu', password: 'tacos' })
      .expect(200)

    expect(res.body.id).toEqual(userId)
  })

  it('returns a 400 if a user signs in with incorrect credentials', async () => {
    await createUser('Tu', 'tacos')

    const res = await request(app)
      .post(`/api/v1/users/sign-in`)
      .send({ name: 'Tu', password: 'burritos' })
      .expect(400)

    expect(res.body.errors[0].message).toEqual('Invalid credentials.')
  })

  it('returns a 400 if a user signs in with a non-existent name', async () => {
    await createUser('Tu', 'tacos')

    const res = await request(app)
      .post(`/api/v1/users/sign-in`)
      .send({ name: 'Brenda', password: 'burritos' })
      .expect(400)

    expect(res.body.errors[0].message).toEqual('User not found: Brenda')
  })

  it('returns a 400 if a user signs in without a name', async () => {
    await createUser('Tu', 'tacos')

    const res = await request(app)
      .post(`/api/v1/users/sign-in`)
      .send({ password: 'tacos' })
      .expect(400)

    expect(res.body.errors[0].message).toEqual('Name is required.')
  })

  it('returns a 400 if a user signs in without a password', async () => {
    await createUser('Tu', 'tacos')

    const res = await request(app)
      .post(`/api/v1/users/sign-in`)
      .send({ name: 'Tu' })
      .expect(400)

    expect(res.body.errors[0].message).toEqual('Password is required.')
  })

  it('returns a 400 if a user signs in without a blank name', async () => {
    await createUser('Tu', 'tacos')

    const res = await request(app)
      .post(`/api/v1/users/sign-in`)
      .send({ name: '', password: 'tacos' })
      .expect(400)

    expect(res.body.errors[0].message).toEqual(
      'Name cannot be an empty string.'
    )
  })

  it('returns a 400 if a user signs in without a blank password', async () => {
    await createUser('Tu', 'tacos')

    const res = await request(app)
      .post(`/api/v1/users/sign-in`)
      .send({ name: 'Tu', password: '' })
      .expect(400)

    expect(res.body.errors[0].message).toEqual(
      'Password cannot be an empty string.'
    )
  })

  it('deletes all games associated with a user when a user is deleted', async () => {
    let res = await createUser('Tu')
    const userId = res.body.id
    const createGame = (userId: string, params: any) => {
      return request(app)
        .post(`/api/v1/users/${userId}/games`)
        .send({ ...params })
        .expect(201)
    }

    const game = await createGame(userId, {})

    await request(app).delete(`/api/v1/users/${userId}`).expect(204)

    res = await request(app)
      .get(`/api/v1/users/${userId}/games/${game.body.id}`)
      .expect(404)

    expect(res.body.errors[0].message).toEqual('Route not found.')
  })
})
