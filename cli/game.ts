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
  boardPositions: number = 4

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
    await this.processSignInOptions()
    await this.setBoard()
    while (true) {
      await this.startGameLoop()
      const { endgame } = await this.inquirer.getEndgameOptions()
      const continueGame = this.processEndgameOptions(endgame)
      if (continueGame) {
        await this.setBoard()
        continue
      }
    }
  }

  async processSignInOptions() {
    const { signIn } = await this.inquirer.getSignInOptions()
    const command = this.parseInput(signIn)
    if (command === 'new') {
      await this.processNewPlayer()
    } else if (command === 'sign') {
      await this.signInExistingPlayer()
    }
  }

  async processNewPlayer() {
    while (true) {
      const { name } = await this.inquirer.getPlayerName()
      const { password } = await this.inquirer.getPlayerPassword()
      const user = await this.server.createUser(name, password)
      if (user === null) {
        this.console.displayUserExists()
        continue
      }
      this.name = user.name
      this.userId = user.id
      const { difficulty } = await this.inquirer.getDifficulty()
      this.difficulty = this.parseInput(difficulty)
      return
    }
  }

  async signInExistingPlayer() {
    while (true) {
      const { name } = await this.inquirer.getPlayerName()
      const { password } = await this.inquirer.getPlayerPassword()
      const user = await this.server.signIn(name, password)
      if (user) {
        this.console.displayLoginSuccess()
        this.name = user.name
        this.userId = user.id
        const { difficulty } = await this.inquirer.getDifficulty()
        this.difficulty = this.parseInput(difficulty)
        return
      }
      this.console.displayLoginFailure()
    }
  }

  processEndgameOptions(endgame: string): boolean | void {
    const command = this.parseInput(endgame)
    if (command === 'play') {
      return true
    } else if (command === 'quit') {
      this.console.displayGoodbye()
      process.exit(0)
    }
  }

  async setBoard() {
    const game = await this.server.createGame(this.userId, this.difficulty)
    this.gameId = game.id
    this.boardPositions = game.board.length
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
      const guesses = await this.inquirer.getPlayerGuess(this.boardPositions)
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
  private parseInput = (input: string): string => {
    return input.split(' ')[0].toLowerCase()
  }

  private mapStringToNumber = (array: string[]): number[] => {
    return array.map((ele) => +ele)
  }
}
