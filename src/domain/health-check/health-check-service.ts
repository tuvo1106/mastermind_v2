import { AppHealth } from './app-health.interface'
import { AppStatus } from '../../application/enums/appStatus'
import { logger } from '../../infra/logger/winston-config-stream'

class HealthCheckService {
  constructor() {}

  getAppHealth(): AppHealth {
    const appHealth = {
      uptime: process.uptime(),
      status: AppStatus.OK,
      timestamp: new Date().toISOString(),
    }
    logger.info(`Response: ${JSON.stringify(appHealth)}`)
    return appHealth
  }
}

const healthCheckService = new HealthCheckService()

export { healthCheckService }
