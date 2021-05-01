import { AppHealth } from './app-health.interface'
import { Status } from '../../application/enums/status'

class HealthCheckService {
  constructor() {}

  getAppHealth(): AppHealth {
    return {
      uptime: process.uptime(),
      status: Status.OK,
      timestamp: Date.now(),
    }
  }
}

const healthCheckService = new HealthCheckService()

export { healthCheckService }
