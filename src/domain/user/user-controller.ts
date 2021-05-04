import { BadRequestError } from './../../application/errors/bad-request-error'
import express from 'express'
import { body } from 'express-validator'

import { userService } from './user-service'

import { validateRequest } from './../../application/middlewares/validate-request'

const router = express.Router()
const basePath = '/api/v1/users'

router.post(
  basePath,
  body('name').not().isEmpty().withMessage('Name is required.'),
  body('password').not().isEmpty().withMessage('Password is required.'),
  validateRequest,
  async (req, res) => {
    const { name, password } = req.body
    const user = await userService.createUser(name, password)
    res.status(201).send(user)
  }
)

router.post(
  basePath + '/sign-in',
  body('name').not().isEmpty().withMessage('Name is required.'),
  body('password').not().isEmpty().withMessage('Password is required.'),
  validateRequest,
  async (req, res) => {
    const { name, password } = req.body
    const user = await userService.signInUser(name, password)
    res.status(200).send(user)
  }
)

router.get(basePath + '/:userId', async (req, res) => {
  const { userId } = req.params
  const user = await userService.getUser(userId)
  res.status(200).send(user)
})

router.delete(basePath + '/:userId', async (req, res) => {
  const { userId } = req.params
  await userService.deleteUser(userId)
  res.sendStatus(204)
})

router.put(basePath + '/:userId', async (req, res) => {
  const { userId } = req.params
  const { name, password } = req.body
  if (name === '') {
    throw new BadRequestError('Name cannot be an empty string.')
  }
  if (password == '') {
    throw new BadRequestError('Password cannot be an empty string.')
  }
  const user = await userService.updateUser(userId, { name, password })
  res.status(200).send(user)
})

export { router as userController }

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         name:
 *           type: name
 *           description: The name of the user
 *         password:
 *           type: password
 *           description: The password of the user
 *       required:
 *         - name
 *         - password
 *       example:
 *         name: "John"
 *         password: "mustard"
 *         id: "j45f0s"
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users API
 */

/**
 * @swagger
 * /api/v1/users:
 *   post:
 *     summary: Creates a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 default: Brenda
 *               password:
 *                 type: string
 *                 default: ketchup
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /api/v1/users/sign-in:
 *   post:
 *     summary: Signs in a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 default: "Tu"
 *               password:
 *                 type: string
 *                 default: "guest"
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /api/v1/users/{userId}:
 *   get:
 *     summary: Returns a user by ID
 *     tags: [Users]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type : string
 *           default: "guest"
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: The resource was not found.
 */

/**
 * @swagger
 * /api/v1/users/{userId}:
 *   delete:
 *     summary: Deletes a user
 *     tags: [Users]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type : string
 *           default: "guest"
 *     responses:
 *       204:
 *         description: The resource was deleted successfully.
 *       404:
 *         description: The resource was not found.
 */

/**
 * @swagger
 * /api/v1/users/{userId}:
 *   put:
 *     summary: Updates a user
 *     tags: [Users]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type : string
 *           default: "guest"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type:
 *                 default: "Jason"
 *               password:
 *                 type: string
 *                 default: "mayo"
 *     responses:
 *       200:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 *       404:
 *         description: The resource was not found.
 */
