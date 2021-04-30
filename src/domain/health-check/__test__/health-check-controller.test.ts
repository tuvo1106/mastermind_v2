import request from 'supertest'

import app from '../../../app'

describe('healthcheck', () => {
  it('returns a 200 if server is healthy', async () => {
    const res = await request(app).get('/').expect(200)

    expect(res.body.status).toEqual('OK')
    expect(res.body.uptime).toBeGreaterThan(0)
    expect(res.body.timestamp).not.toBeUndefined()
  })
})
