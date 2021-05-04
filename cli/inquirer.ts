import inquirer from 'inquirer'

interface GuessInputs {
  'input-1': string
  'input-2': string
  'input-3': string
  'input-4': string
}

export class Inquirer {
  constructor() {}

  getSignInOptions() {
    return inquirer.prompt([
      {
        type: 'list',
        name: 'signIn',
        message: 'Please select an option:',
        choices: ['New player', 'Sign in'],
      },
    ])
  }

  getPlayerName() {
    return inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'What is your name?',
        validate: (value: any) => {
          if (value.length >= 25) {
            return 'Please keep the name to under 25 characters.'
          }
          return true
        },
      },
    ])
  }

  getDifficulty() {
    return inquirer.prompt([
      {
        type: 'list',
        name: 'difficulty',
        message: 'Select your difficulty?',
        choices: [
          'Test - 3 turns',
          'Easy - 12 turns',
          'Normal - 10 turns',
          'Hard - 8 turns',
          new inquirer.Separator(),
          {
            name: 'Dark Souls - 6 turns',
            disabled: 'Unavailable at this time',
          },
        ],
      },
    ])
  }

  getPlayerPassword() {
    return inquirer.prompt([
      {
        type: 'password',
        name: 'password',
        message: 'What is your password?',
      },
    ])
  }

  getPlayerGuess(): Promise<GuessInputs> {
    const questionArray = ['1', '2', '3', '4'].map((num) => {
      return {
        type: 'input',
        name: `input-${num}`,
        message: `Enter in your guess for position ${num}:`,
        validate: (value: any) => {
          if (isNaN(value) || !!(value % 1)) {
            return 'Please enter in a number.'
          }
          if (+value < 0 || +value > 9) {
            return 'Please enter in a number between 0 and 9.'
          }
          return true
        },
      }
    })
    return inquirer.prompt(questionArray)
  }

  getEndgameOptions() {
    return inquirer.prompt([
      {
        type: 'list',
        name: 'endgame',
        message: 'What would you like to do next?',
        choices: [
          'Play again.',
          { name: 'View leader board.', disabled: 'In development' },
          'Quit game.',
        ],
      },
    ])
  }
}
