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
