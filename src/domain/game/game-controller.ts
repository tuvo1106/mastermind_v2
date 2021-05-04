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
  res.sendStatus(204)
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

/**
 * @swagger
 * components:
 *   schemas:
 *     Game:
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         createdAt:
 *           type: string
 *           description: The date and time the game was created at
 *           format: date-time
 *         state:
 *           type: string
 *           description: The state of the game.
 *         totalGuesses:
 *           type: integer
 *           description: The total number of guesses the user is allowed to make
 *         guessesRemaining:
 *           type: integer
 *           description: The number of guesses remaining in the game
 *         board:
 *           type: array
 *           description: The game board
 *           items:
 *             type: integer
 *         history:
 *           type: array
 *           description: The history of guesses that the user made
 *           items:
 *             type: object
 *             properties:
 *               correctColors:
 *                 type: number
 *               correctPositions:
 *                 type: number
 *               guess:
 *                 type: array
 *                 items:
 *                   type: integer
 *         userId:
 *           type: string
 *           description: The state of the game.
 *       required:
 *         - id
 *         - createdAt
 *         - state
 *         - totalGuesses
 *         - guessesRemaining
 *         - board
 *         - history
 *         - userId
 *       example:
 *         id: "TCbfHC"
 *         createdAt : "2021-05-04T06:13:01.204Z"
 *         state : "ACTIVE"
 *         totalGuesses : 3
 *         guessesRemaining : 3
 *         board : [4,4,5,5]
 *         history : [{correctColors: 3, correctPosition: 1, guess: [1, 2, 4, 7]}]
 *         userId : "n8LqUJ"
 */

/**
 * @swagger
 * tags:
 *   name: Games
 *   description: The games API
 */

/**
 * @swagger
 * /api/v1/users/{userId}/games:
 *   post:
 *     summary: Creates a new game
 *     tags: [Games]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type : string
 *           default: guest
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               difficulty:
 *                 type: string
 *                 default: easy
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       400:
 *         description: Bad request
 *       404:
 *         description: The resource was not found.
 */

/**
 * @swagger
 * /api/v1/users/{userId}/games/{gameId}:
 *   get:
 *     summary: Returns a game by gameID and userID
 *     tags: [Games]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type : string
 *           default: guest
 *       - name: gameId
 *         in: path
 *         required: true
 *         schema:
 *           type : string
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       404:
 *         description: The resource was not found.
 */

/**
 * @swagger
 * /api/v1/users/{userId}/games/{gameId}:
 *   delete:
 *     summary: Deletes a game
 *     tags: [Games]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type : string
 *           default: guest
 *       - name: gameId
 *         in: path
 *         required: true
 *         schema:
 *           type : string
 *     responses:
 *       204:
 *         description: The resource was deleted successfully.
 *       404:
 *         description: The resource was not found.
 */

/**
 * @swagger
 * /api/v1/users/{userId}/games/{gameId}/guess:
 *   post:
 *     summary: Deletes a game
 *     tags: [Games]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type : string
 *           default: guest
 *       - name: gameId
 *         in: path
 *         required: true
 *         schema:
 *           type : string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               guess:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 default: [1, 2, 3, 4]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       400:
 *         description: Bad request
 *       404:
 *         description: The resource was not found.
 */
