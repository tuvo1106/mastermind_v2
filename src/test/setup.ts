import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { inMemoryRepository } from '../infra/repository/in-memory-repository'
import { logger } from '../infra/logger/winston-config-stream'

let mongo: any

beforeAll(async () => {
  if (process.env.DB === 'mongo') {
    logger.info('Testing with Mongo.')
    mongo = new MongoMemoryServer()
    const mongoUri = await mongo.getUri()

    return await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
  }
  logger.info('Testing with local db.')
})

beforeEach(async () => {
  jest.clearAllMocks()
  if (process.env.DB === 'mongo') {
    const collections = await mongoose.connection.db.collections()
    for (let collection of collections) {
      await collection.deleteMany({})
    }
  }
  inMemoryRepository.flush()
})

afterAll(async () => {
  if (process.env.DB === 'mongo') {
    await mongo.stop()
    await mongoose.connection.close()
    logger.info('Closing Mongo connection.')
  }
})
