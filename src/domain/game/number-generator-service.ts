import axios from 'axios'

import { logger } from '../../infra/logger/winston-config-stream'

export class NumberGeneratorService {
  private readonly DEFAULT_TOTAL_NUM = 4
  private readonly DEFAULT_MIN = 0
  private readonly DEFAULT_MAX = 9

  constructor() {}

  async getRandomNumbers(
    num: number = this.DEFAULT_TOTAL_NUM,
    min: number = this.DEFAULT_MIN,
    max: number = this.DEFAULT_MAX
  ) {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.NODE_ENV === 'test'
    ) {
      return this.getRandomNumbersLocally(num, min, max)
    }
    try {
      const { status, data } = await this.getRandomNumbersFromAPI(num, min, max)
      const arrayOfNumbers = this.parseStringToNumbers(data)
      logger.info(`Response: { status: ${status}, data: ${arrayOfNumbers} }`)
      return arrayOfNumbers
    } catch (e) {
      logger.error(`Error: ${JSON.stringify(e)}`)
      return this.getRandomNumbersLocally(num, min, max)
    }
  }

  private getRandomNumbersFromAPI(num: number, min: number, max: number) {
    const url = `https://www.random.org/integers/?num=${num}&min=${min}&max=${max}&col=1&base=10&format=plain&rdn=new`
    logger.info(`GET: ${url}`)
    return axios.get(url)
  }

  private getRandomNumbersLocally(
    num: number,
    min: number,
    max: number
  ): number[] {
    const array = []
    for (let i = 0; i < num; i++) {
      array.push(this.getRandomNumberInRange(min, max))
    }
    return array
  }

  private getRandomNumberInRange(min: number, max: number): number {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min)
  }

  private parseStringToNumbers(str: string): number[] {
    const array = str.trim().split('\n')
    return array.map((char) => +char)
  }
}
