import app from './app'

import { logger } from './infra/logger/winston-config-stream'

const startApp = () => {
  const PORT = 3000
  app.listen(PORT, () => {
    logger.info(`Connected to Express at port ${PORT}.`)
  })
}

startApp()
