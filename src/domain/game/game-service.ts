import { NumberGeneratorService } from './number-generator-service'
import { Repository } from '../../infra/repository/respository.interface'
import { inMemoryRepository } from './../../infra/repository/in-memory-repository'
import { GameEntity } from './game-entity'

class GameService {
  private repository

  constructor(repository: Repository) {
    this.repository = repository
  }

  async createGame(userId: string, difficulty: string): Promise<GameEntity> {
    const guesses = this.getNumberOfGuessesForDifficulty(difficulty)
    const numberGeneratorService = new NumberGeneratorService()
    const numbers = await numberGeneratorService.getRandomNumbers()
    return await this.repository.createGame(userId, numbers, guesses)
  }

  async getGame(userId: string, gameId: string): Promise<GameEntity> {
    return await this.repository.getGame(userId, gameId)
  }

  async deleteGame(userId: string, gameId: string): Promise<void> {
    return await this.repository.deleteGame(userId, gameId)
  }

  // async updateUser(
  //   userId: string,
  //   params: { name: string }
  // ): Promise<UserEntity> {
  //   return await this.repository.updateUser(userId, params)
  // }
  private getNumberOfGuessesForDifficulty(difficulty: string) {
    const DEFAULT_TURNS = 10
    if (!difficulty) return DEFAULT_TURNS
    const guessMap = new Map([
      ['easy', 12],
      ['normal', 10],
      ['hard', 8],
    ])
    return guessMap.get(difficulty.toLowerCase()) || DEFAULT_TURNS
  }
}

const gameService = new GameService(inMemoryRepository)

export { gameService }
