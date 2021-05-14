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
            disabled: 'Currently in development',
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

  getPlayerGuess(numberOfPrompts: number = 4): Promise<GuessInputs> {
    const arr = []
    for (let i = 1; i < numberOfPrompts + 1; i++) {
      arr.push(i.toString())
    }
    const questionArray = arr.map((num) => {
      return {
        type: 'input',
        name: `input-${num}`,
        message: `Enter in your guess for position ${num}:`,
        validate: (value: any) => {
          value = value.trim()
          if (value === '') {
            return 'The guess cannot be empty.'
          }
          if (isNaN(value)) {
            return 'Please enter in a number.'
          }
          if (!Number.isInteger(+value)) {
            return 'Please enter in an integer.'
          }
          if (+value < 0 || +value > 7) {
            return 'Please enter in a number between 0 and 7.'
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
