import { numberGeneratorService } from './../number-generator-service'

describe('numberGeneratorService', () => {
  const spy = jest.spyOn(
    numberGeneratorService as any,
    'getRandomNumbersFromAPI'
  )

  // to prevent rate limiting issues
  test.skip('fetches random numbers from random.org', async () => {
    process.env.NODE_ENV = 'production'

    const numbers = await numberGeneratorService.getRandomNumbers()

    expect(numbers).toBeDefined()
    expect(Array.isArray(numbers)).toEqual(true)
  })

  it('fetches random numbers from the web', async () => {
    process.env.NODE_ENV = 'production'

    const mockNumbers = `1\n2\n3\n4\n`

    spy.mockImplementation(() => {
      return new Promise((resolve) =>
        resolve({
          data: mockNumbers,
          status: 200,
        })
      )
    })

    const numbers = await numberGeneratorService.getRandomNumbers()

    expect(spy).toHaveBeenCalled()
    expect(numbers).toBeDefined()
    expect(Array.isArray(numbers)).toEqual(true)
    expect(numbers).toEqual([1, 2, 3, 4])
  })

  it('fetches random number locally when the API fails', async () => {
    process.env.NODE_ENV = 'production'

    spy.mockImplementation(() => {
      throw new Error()
    })

    const localSpy = jest.spyOn(
      numberGeneratorService as any,
      'getRandomNumbersLocally'
    )

    spy.mockImplementation(() => [1, 2, 3, 4])

    const numbers = await numberGeneratorService.getRandomNumbers()

    expect(spy).toHaveBeenCalled()
    expect(localSpy).toHaveBeenCalled()
    expect(numbers).toBeDefined()
    expect(Array.isArray(numbers)).toEqual(true)
  })
})
