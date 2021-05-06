import mongoose, { Schema } from 'mongoose'
import { GameStatus } from '../../../../application/enums/gameStatus'
import { Score } from '../../../../domain/game/game-entity'

interface GameAttrs {
  createdAt: Date
  state: GameStatus
  totalGuesses: number
  guessesRemaining: number
  board: number[]
  history: Score[]
  userId: string
}

interface GameModel extends mongoose.Model<GameDoc> {
  build(attrs: GameAttrs): GameDoc
}

interface GameDoc extends mongoose.Document {
  createdAt: Date
  state: GameStatus
  totalGuesses: number
  guessesRemaining: number
  board: number[]
  history: Score[]
  userId: string
  id: string
}

const gameSchema = new mongoose.Schema(
  {
    createdAt: {
      type: Date,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    totalGuesses: {
      type: Number,
      required: true,
    },
    guessesRemaining: {
      type: Number,
      required: true,
    },
    board: {
      type: [Number],
      required: true,
    },
    history: {
      type: [Schema.Types.Mixed],
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
      },
    },
  }
)

gameSchema.statics.build = (attrs: GameAttrs) => {
  return new Game(attrs)
}

const Game = mongoose.model<GameDoc, GameModel>('Game', gameSchema)

export { Game }
