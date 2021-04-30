import { appHealth } from '../../application/interfaces/app-health'
import { Status } from '../../application/enums/status'

class HealthCheckService {
  constructor() {}

  getAppHealth(): appHealth {
    return {
      uptime: process.uptime(),
      status: Status.OK,
      timestamp: Date.now(),
    }
  }
}

const healthCheckService = new HealthCheckService()

export { healthCheckService }
