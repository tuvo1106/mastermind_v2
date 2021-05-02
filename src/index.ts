import app from './app'

import { logger } from './infra/logger/winston-config-stream'

const startApp = () => {
  const PORT = process.env.PORT
  app.listen(PORT, () => {
    logger.info(`Connected to Express on port: ${PORT}.`)
  })
}

startApp()
