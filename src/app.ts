import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import morgan from 'morgan'

import { healthCheckController } from './domain/health-check/health-check-controller'
import { userController } from './domain/user/user-controller'
import { gameController } from './domain/game/game-controller'

import { logger } from './infra/logger/winston-config-stream'
import { errorHandler } from './application/middlewares/error-handler'

import { NotFoundError } from './application/errors/not-found-error'

import dotenv from 'dotenv'
dotenv.config()

const app = express()

app.use(json())

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
