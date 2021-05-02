import express from 'express'
import { body } from 'express-validator'

import { userService } from './user-service'

import { validateRequest } from './../../application/middlewares/validate-request'

const router = express.Router()
const basePath = '/api/v1/users'

router.post(
  basePath,
  body('name').not().isEmpty().withMessage('Name is required.'),
  validateRequest,
  async (req, res) => {
    const { name } = req.body
    const user = await userService.createUser(name)
    res.status(201).send(user)
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

router.put(
  basePath + '/:userId',
  body('name').not().isEmpty().withMessage('Name cannot be empty.'),
  validateRequest,
  async (req, res) => {
    const { userId } = req.params
    const user = await userService.updateUser(userId, req.body)
    res.status(200).send(user)
  }
)

export { router as userController }
