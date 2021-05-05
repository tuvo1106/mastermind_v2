import fs from 'fs'

import { ApolloServer } from 'apollo-server-express'
import { userService } from '../../domain/user/user-service'
import { healthCheckService } from '../../domain/health-check/health-check-service'
import { gameService } from '../../domain/game/game-service'

import { Query } from './Query'
import { Mutation } from './Mutation'

const schemaPath = __dirname + '/schema.graphql'
const typeDefs = fs.readFileSync(schemaPath).toString('utf-8')

const gqlServer = new ApolloServer({
  typeDefs,
  resolvers: {
    Query: Query,
    Mutation: Mutation,
  },
  context: {
    healthCheckService: healthCheckService,
    userService: userService,
    gameService: gameService,
  },
})

export { gqlServer }
