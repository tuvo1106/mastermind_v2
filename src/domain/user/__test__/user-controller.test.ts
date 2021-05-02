import request from 'supertest'

import { inMemoryRepository } from './../../../infra/repository/in-memory-repository'

import app from '../../../app'

const createUser = (name: string) => {
  return request(app)
    .post('/api/v1/users')
    .send({
      name,
    })
    .expect(201)
}

describe('user', () => {
  beforeEach(() => {
    inMemoryRepository.flush()
  })

  it('returns a 201 if a new user is able to be created', async () => {
    const res = await createUser('Tu')

    expect(res.body.name).toEqual('Tu')
  })

  it('returns a 400 if the user already exists', async () => {
    await createUser('Tu')

    await request(app)
      .post('/api/v1/users')
      .send({
        name: 'Tu',
      })
      .expect(400)
  })

  it('returns a 400 if a name is not provided on POST', async () => {
    await request(app).post('/api/v1/users').send({}).expect(400)
  })

  it('returns a 400 if a name is an empty string on POST', async () => {
    await request(app).post('/api/v1/users').send({ name: '' }).expect(400)
  })

  it('returns a user if that user exists', async () => {
    const name = 'Tu'
    let res = await createUser('Tu')
    const userId = res.body.id

    res = await request(app).get(`/api/v1/users/${userId}`).expect(200)

    expect(res.body.name).toBe(name)
  })

  it('returns a 404 if the user does not exist on GET', async () => {
    const userId = 'abc123'
    await request(app).get(`/api/v1/users/${userId}`).expect(404)
  })

  it('returns a 204 if a valid user is deleted', async () => {
    const res = await createUser('Tu')
    const userId = res.body.id

    await request(app).delete(`/api/v1/users/${userId}`).expect(204)

    await request(app).get(`/api/v1/users/${userId}`).expect(404)
  })

  it('returns a 404 if an invalid user is deleted', async () => {
    const userId = 'abc123'
    await request(app).delete(`/api/v1/users/${userId}`).expect(404)
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

  it('does not update user with invalid params', async () => {
    const res = await createUser('Tu')
    const userId = res.body.id

    const updated = await request(app)
      .put(`/api/v1/users/${userId}`)
      .send({ name: 'Brenda', occupation: 'developer' })
      .expect(200)

    expect(updated.body.name).toEqual('Brenda')
    expect(updated.body.occupation).not.toBeDefined()
  })

  it('returns a 404 if a user does not exist on PUT', async () => {
    const userId = 'abc123'
    await request(app)
      .put(`/api/v1/users/${userId}`)
      .send({ name: 'Brenda' })
      .expect(404)
  })

  it('returns a 400 if a name is not provided on PUT', async () => {
    const res = await createUser('Tu')
    const userId = res.body.id

    await request(app).put(`/api/v1/users/${userId}`).send({}).expect(400)
  })

  it('returns a 400 if a name is an empty string on POST', async () => {
    const res = await createUser('Tu')
    const userId = res.body.id

    await request(app)
      .put(`/api/v1/users/${userId}`)
      .send({ name: '' })
      .expect(400)
  })
})
