import app from './app'
import mongoose from 'mongoose'

import { seedDatabase } from './application/scripts/seed-database'
import { logger } from './infra/logger/winston-config-stream'

const startApp = () => {
  const PORT = process.env.PORT || 3000
  checkEnvVariables()
  app.listen(PORT, async () => {
    if (process.env.DB === 'mongo') {
      await connectToMongo()
    }
    logger.info(`Connected to Express on port: ${PORT}.`)
    seedDatabase()
  })
}

const checkEnvVariables = () => {
  if (process.env.DB !== 'local' && process.env.DB !== 'mongo') {
    logger.warn(
      'The following env variable is not set: `DB`. Defaulting to `local`.'
    )
    process.env.DB = 'local'
  }
  if (process.env.NODE_ENV === undefined || process.env.null) {
    logger.warn(
      'The following env variable is not set: `NODE_ENV`. Defaulting to `development`.'
    )
    process.env.NODE_ENV = 'development'
  }
}

const connectToMongo = async () => {
  const MONGO_PORT = process.env.MONGO_PORT || 27017
  try {
    await mongoose.connect(`mongodb://mongo:${MONGO_PORT}/mastermind_v2`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    logger.info(`Connected to MongoDB on port: ${MONGO_PORT}.`)
  } catch (err) {
    logger.error(err)
    logger.error('Could not connect to MongoDB. Using local database instead.')
    process.env.DB = 'local'
  }
}

startApp()
