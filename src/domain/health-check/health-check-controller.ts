import express from 'express'

const router = express.Router({})

import { healthCheckService } from './health-check-service'

import { logger } from '../../infra/logger/winston-config-stream'

router.get('/', async (req, res, next) => {
  const healthCheck = healthCheckService.getAppHealth()
  res.send(healthCheck)
  logger.info(`Response: ${JSON.stringify(healthCheck)}`)
})

export { router as healthCheckController }
