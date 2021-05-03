import axios from 'axios'

import { logger } from '../src/infra/logger/winston-config-stream'

export class Server {
  constructor() {}

  async createUser(name: string) {
    try {
      const res = await axios.post('http://localhost:3000/api/v1/users', {
        name,
      })
      return res.data
    } catch (err) {
      logger.error(err.message)
    }
  }

  async createGame(userId: string, difficulty: string) {
    try {
      const res = await axios.post(
        `http://localhost:3000/api/v1/users/${userId}/games`,
        {
          difficulty,
        }
      )
      return res.data
    } catch (err) {
      logger.error(err.message)
    }
  }

  async getGame(userId: string, gameId: string) {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/v1/users/${userId}/games/${gameId}`
      )
      return res.data
    } catch (err) {
      logger.error(err.message)
    }
  }

  async postGuess(userId: string, gameId: string, guess: number[]) {
    try {
      const res = await axios.post(
        `http://localhost:3000/api/v1/users/${userId}/games/${gameId}/guess`,
        {
          guess,
        }
      )
      return res.data
    } catch (err) {
      logger.error(err.message)
    }
  }
}
