import { AppHealth } from './app-health.interface'
import { AppStatus } from '../../application/enums/appStatus'

class HealthCheckService {
  constructor() {}

  getAppHealth(): AppHealth {
    return {
      uptime: process.uptime(),
      status: AppStatus.OK,
      timestamp: new Date().toISOString(),
    }
  }
}

const healthCheckService = new HealthCheckService()

export { healthCheckService }
