const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mastermind v2',
      version: '1.0.0',
      description: 'A Mastermind API in Express and Typescript',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: [
    './src/domain/health-check/*.ts',
    './src/domain/user/*.ts',
    './src/domain/game/*.ts',
  ],
}

export { swaggerOptions }
