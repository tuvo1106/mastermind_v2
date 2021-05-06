import express from 'express'

const router = express.Router({})

import { healthCheckService } from './health-check-service'

router.get('/', async (req, res, next) => {
  const healthCheck = healthCheckService.getAppHealth()
  res.send(healthCheck)
})

export { router as healthCheckController }

/**
 * @swagger
 * components:
 *   schemas:
 *     AppHealth:
 *       properties:
 *         uptime:
 *           type: float
 *           description: How long the app has been running
 *         status:
 *           type: string
 *           description: The state of the application
 *         timestamp:
 *           type: string
 *           description: The time the server started
 *       required:
 *         - uptime
 *         - status
 *         - timestamp
 *       example:
 *         uptime: 1.510697956
 *         status: "OK"
 *         timestamp : "2021-05-05T02:35:11.774Z"
 */

/**
 * @swagger
 * tags:
 *   name: App
 *   description: The healthApp API
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Gets a summary of the app's current health
 *     tags: [App]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppHealth'
 */
