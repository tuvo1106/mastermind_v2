import express from 'express'
import { body } from 'express-validator'

import { gameService } from './game-service'
import { userService } from '../user/user-service'
import { gameParamsValidatorService } from './game-params-validator-service'

import { validateRequest } from './../../application/middlewares/validate-request'

const router = express.Router()
const basePath = '/api/v1/users/:userId/games'

router.post(
  basePath,
  body('difficulty').custom(gameParamsValidatorService.isValidDifficulty),
  validateRequest,
  async (req, res) => {
    const { userId } = req.params
    await userService.getUser(userId)
    const { difficulty } = req.body
    const game = await gameService.createGame(userId, difficulty)
    res.status(201).send(game)
  }
)

router.get(basePath + '/:gameId', async (req, res) => {
  const { userId, gameId } = req.params
  const game = await gameService.getGame(userId, gameId)
  res.status(200).send(game)
})

router.delete(basePath + '/:gameId/', async (req, res) => {
  const { userId, gameId } = req.params
  await gameService.deleteGame(userId, gameId)
  res.send(204)
})

router.post(
  basePath + '/:gameId/guess',
  body('guess').custom(gameParamsValidatorService.isValidGuess),
  validateRequest,
  async (req, res) => {
    const { userId, gameId } = req.params
    const { guess } = req.body
    const game = await gameService.processGuess(userId, gameId, guess)
    res.status(200).send(game)
  }
)

export { router as gameController }
