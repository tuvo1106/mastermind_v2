import axios from 'axios'

export class Server {
  constructor() {}

  async createUser(name: string, password: string) {
    try {
      const res = await axios.post('http://localhost:3000/api/v1/users', {
        name,
        password,
      })
      return res.data
    } catch (err) {
      return null
    }
  }

  async signIn(name: string, password: string) {
    try {
      const res = await axios.post(
        'http://localhost:3000/api/v1/users/sign-in',
        { name, password }
      )
      return res.data
    } catch (err) {
      return null
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
      return null
    }
  }

  async getGame(userId: string, gameId: string) {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/v1/users/${userId}/games/${gameId}`
      )
      return res.data
    } catch (err) {
      return null
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
      return null
    }
  }
}
