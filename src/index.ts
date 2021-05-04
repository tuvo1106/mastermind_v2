import app from './app'

import { seedDatabase } from './application/scripts/seed-database'
import { logger } from './infra/logger/winston-config-stream'

const startApp = () => {
  const PORT = process.env.PORT || 3000
  app.listen(PORT, () => {
    logger.info(`Connected to Express on port: ${PORT}.`)
    if (process.env.NODE_ENV === 'development') {
      seedDatabase()
    }
  })
}

startApp()
