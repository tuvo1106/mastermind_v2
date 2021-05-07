import express from 'express'
import 'express-async-errors'
import cors from 'cors'
import { json } from 'body-parser'
import morgan from 'morgan'
import swaggerUI from 'swagger-ui-express'
import swaggerJsDoc from 'swagger-jsdoc'
import helmet from 'helmet'
import hpp from 'hpp'
import rateLimit from 'express-rate-limit'
import mongoSanitize from 'express-mongo-sanitize'

import { healthCheckController } from './domain/health-check/health-check-controller'
import { userController } from './domain/user/user-controller'
import { gameController } from './domain/game/game-controller'

import { logger } from './infra/logger/winston-config-stream'
import { gqlServer } from './infra/graphql/apollo-server-config'
import { swaggerOptions } from './infra/api-docs/swagger-config'

import { errorHandler } from './application/middlewares/error-handler'

import { NotFoundError } from './application/errors/not-found-error'

import dotenv from 'dotenv'

dotenv.config()

const app = express()

app.use(cors())
app.use(json())

// Security
app.use(
  helmet({
    contentSecurityPolicy: false, // for GraphQL
  })
)
app.use(hpp())
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
})
app.use(limiter)
app.use(mongoSanitize())

// Swagger
const specs = swaggerJsDoc(swaggerOptions)
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs))

// GraphQL
gqlServer.applyMiddleware({ app })

// Morgan/Winston
// @ts-ignore
app.use(morgan('combined', { stream: logger.stream }))

// Routers
app.use(healthCheckController)
app.use(userController)
app.use(gameController)

// Favicon
app.get('/favicon.ico', (req, res) => res.status(204))

// All other routes
app.all('*', async (req, res) => {
  throw new NotFoundError()
})

app.use(errorHandler)

export default app
