import { healthCheckService } from '../health-check-service'

describe('healthcheck', () => {
  it('returns a appHealth object with defined values', () => {
    const res = healthCheckService.getAppHealth()

    expect(res.status).not.toBeUndefined()
    expect(res.timestamp).not.toBeUndefined()
    expect(res.uptime).not.toBeUndefined()
  })
})
