import axios from 'axios'

import { Game } from './game'

const pingServer = async () => {
  try {
    console.log('Connecting to server...')
    const res = await axios.get('http://localhost:3000/')
    return res.data
  } catch (err) {
    console.error('Not connected to server. Please try again.')
  }
}

const play = async () => {
  try {
    const res = await pingServer()
    if (res?.status === 'OK') {
      console.log('Connected!')
      const game = new Game()
      game.startNewGame()
    }
  } catch (err) {
    console.error('App is in bad health. Exiting.')
    process.exit(1)
  }
}

play()
