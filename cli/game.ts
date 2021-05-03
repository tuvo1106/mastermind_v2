import { Server } from './server'
import { Console } from './console'
import { Inquirer } from './inquirer'

import { GameStatus } from '../src/application/enums/gameStatus'

export class Game {
  readonly DEFAULT_PLAYER_NAME = 'PLAYER_ONE'
  readonly DEFAULT_DIFFICULTY = 'normal'

  name: string = this.DEFAULT_PLAYER_NAME
  difficulty: string = this.DEFAULT_DIFFICULTY
  userId: string = ''
  gameId: string = ''

  console: Console
  inquirer: Inquirer
  server: Server

  constructor() {
    this.console = new Console()
    this.inquirer = new Inquirer()
    this.server = new Server()
  }

  async startNewGame() {
    this.console.displayTitle()
    await this.processPlayerOptions()
    await this.setBoard()
    while (true) {
      await this.startGameLoop()
      const { endgame } = await this.inquirer.getEndgameOptions()
      const continueGame = this.processEndgameOptions(endgame)
      if (continueGame) {
        this.setBoard()
        continue
      }
    }
  }

  async processPlayerOptions() {
    const playerOptions = await this.inquirer.getPlayerOptions()
    const { name, difficulty } = playerOptions
    if (name) {
      this.name = name
    }
    this.difficulty = difficulty.split(' ')[0].toLowerCase()
  }

  processEndgameOptions(endgame: string): boolean | void {
    const command = endgame.split(' ')[0].toLowerCase()
    if (command === 'play') {
      return true
    } else if (command === 'quit') {
      this.console.displayGoodbye()
      process.exit(0)
    }
  }

  async setBoard() {
    if (!this.userId) {
      const user = await this.server.createUser(this.name)
      this.userId = user.id
    }
    const game = await this.server.createGame(this.userId, this.difficulty)
    this.gameId = game.id
  }

  async startGameLoop() {
    let game = null
    this.console.displayInstructions()
    this.console.displayGoodLuck(this.name)
    while (true) {
      if (game === null) {
        game = await this.server.getGame(this.userId, this.gameId)
      }
      this.console.displayGuessPrompt(game.guessesRemaining)
      const guesses = await this.inquirer.getPlayerGuess()
      game = await this.server.postGuess(
        this.userId,
        this.gameId,
        this.mapStringToNumber(Object.values(guesses))
      )
      this.console.displayScore(game.history)
      this.console.displayKey()
      if (game.state !== GameStatus.ACTIVE) {
        return game.state === GameStatus.LOSE
          ? this.console.displayLoss(this.name, game.board)
          : this.console.displayVictory()
      }
    }
  }

  private mapStringToNumber = (array: string[]): number[] => {
    return array.map((ele) => +ele)
  }
}
