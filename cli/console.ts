import { Score } from '../src/domain/game/game-entity'

export class Console {
  private readonly correctPositionIcon = 'X'
  private readonly correctColorIcon = 'O'
  private readonly leftOverIcon = '*'

  constructor() {}

  displayTitle() {
    const title = `
=============================================================================================

MASTERMIND

=============================================================================================
Test your code-cracking prowess with Mastermind, the challenging game of logic and deduction.
=============================================================================================
`
    console.log(title)
  }

  displayInstructions() {
    const instructions = `
=============================================================================================
Try to guess the correct number sequence by entering four numbers.
=============================================================================================
`
    console.log(instructions)
  }

  displayScore(history: Score[]) {
    const scores = this.buildScores(history)

    const scoreBoard = `
=============================================================================================
 #     Guesses                Scores

${scores}             
=============================================================================================
`
    console.log(scoreBoard)
  }

  displayKey() {
    const key = `
X = Correct number, correct location
O = Correct number, incorrect location
* = Incorrect number, incorrect location
`
    console.log(key)
  }

  displayGoodbye() {
    console.log('\nThanks for playing! Goodbye.')
  }

  displayGuessPrompt(guessesRemaining: number) {
    console.log(`\n${guessesRemaining} turns left.`)
    console.log('Please enter a number between 0 and 7.\n')
  }

  displayVictory() {
    console.log('You have won!\n')
  }

  displayLoss(name: string, board: number[]) {
    console.log(`Better luck next time, ${name}!`)
    console.log(`The answer was ${this.boardToString(board)}.\n`)
  }

  displayGoodLuck(name: string) {
    console.log(`Good luck, ${name}. Have fun!`)
  }

  displayLoginSuccess() {
    console.log('\nSign in successful.')
  }

  displayLoginFailure() {
    console.log('The name and password do not match. Please try again.')
  }

  displayUserExists() {
    console.log('User already exists. Please try again.')
  }

  private buildScores(history: Score[]): string {
    let res = ''
    history.forEach((score, index) => {
      let num = index + 1
      let tmp = ` ${num < 10 ? num + '. ' : num + '.'}   `
      tmp += this.buildScore(score)
      res += tmp
    })
    return res
  }

  private buildScore(score: Score): string {
    const boardLength = score.guess.length
    let tmp = ''
    tmp +=
      `${this.boardToString(score.guess)}           ` +
      this.buildString(score.correctPositions, this.correctPositionIcon) +
      this.buildString(score.correctColors, this.correctColorIcon) +
      this.buildString(
        boardLength - score.correctPositions - score.correctColors,
        this.leftOverIcon
      ) +
      '\n'
    return tmp
  }

  private buildString = (loops: number, icon: string): string => {
    return Array(loops)
      .fill('')
      .reduce((string, _) => {
        return string + icon + ' '
      }, '')
  }

  private boardToString(board: number[]): string {
    return `[${board.join(', ')}]`
  }
}
