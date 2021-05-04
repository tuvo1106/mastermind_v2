import request from 'supertest'
import app from './app'

describe('app', () => {
  it('returns a 404 if a user lands on an invalid route', async () => {
    const res = await request(app).get('/api/v1/ice-cream').expect(404)

    expect(res.body.errors[0].message).toEqual('Route not found.')
  })
})
