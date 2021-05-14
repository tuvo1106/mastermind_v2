# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### [0.6.0] - 2021-05-13

#### Added

- Difficulty levels now determine number of positions on board
  - i.e. `easy` only has 3 numbers on board

#### Changed

- Refactor `getPlayerGuess` to dynamically get number of guesses
  - Fix bug that users can enter in a blank string
  - Remove unclear validator method for floats, use `Number.isInteger` instead
- Enhance tests in gameService to have better descriptions
  - Also add additional tests to cover more cases
- API no longer passes back user password in any request

### [0.5.2] - 2021-05-06

#### Added

- Security middleware:
  - express-rate-limiter - protection against DDOS attacks
  - express-mongo-sanitize - protection against SQL injections
  - hpp - protection against HTTP parameter pollution
  - helmet - secures app by setting various HTTP headers

#### Changed

- Encrypt user passwords before persisting them
- Simplify seed script

### [0.5.1] - 2021-05-06

#### Added

- Test to cover edge case
- Function to set default env variables if they are not set

#### Changed

- Fix bug on user deletion
- Update README.md

### [0.5.0] - 2021-05-05

#### Added

- Dockerfiles for MongoDB/Node containers
- MongoRepository implementation
- Jest setup script for different environments
- Game and User mongoose schemas

#### Changed

- Change ID size to be 24 characters to match MongoDB ID's
- Change seed script to be database agnostic
- Change tests to be database agnostic

### [0.4.0] - 2021-05-04

#### Added

- GraphQL support for all endpoints
- Custom validator classes instead of relying on outside lib
  - Allows for better decoupling of application logic
- UserParamsValidatorService
- More tests
- More logging at persistence layer

#### Changed

- Update Swagger docs
- Remove validation middleware
- Trim controllers to have little to none business logic

### [0.3.2] - 2021-05-03

#### Added

- Swagger API documentation

#### Changed

- Update README.md

### [0.3.1] - 2021-05-03

#### Added

- NumberGeneratorService tests
- More tests for better test coverage

#### Changed

- Update README.md
- Change max number in game board to 7

### [0.3.0] - 2021-05-03

#### Added

- Password field on user
- More tests for better test coverage

#### Changed

- Game will allow users to sign in
- Remove logging from game CLI
- UserFactory can now set ids and passwords
- Update tests to ensure error messages are correct

### [0.2.0] - 2021-05-03

#### Added

- Game CLI
- Game, Server, Console, Inquirer classes

#### Changed

- Change Score object to also contain previous guesses
- Update winston to utilize chalk colors

### [0.1.0] - 2021-05-02

#### Added

- GameParamsValidatorService
- Script to seed database in 'development` env

#### Changed

- Update logic in GameController/GameService to process guesses
- Change NumberGeneratorService to be a singleton class

### [0.0.3] - 2021-05-02

#### Added

- Environmental variables
- Game controller/service and tests
- GameStatus enum
- GameFactory
- GameEntity
- NumberGeneratorService

#### Changed

- Rename status enum
- Change validateRequest behavior to log out errors
- Update Repository abstract class and its implementations

### [0.0.2] - 2021-04-30

#### Added

- User controller/service and tests
- Abstract Repository
- InMemoryRepository implementation
- BadRequestError and RequestValidationError
- UserFactory
- AppHealth interface
- ValidateRequest middleware
- UserEntity
- Validation middleware (express-validator)

#### Changed

- Renamed various interface files
- Script names

### [0.0.1] - 2021-04-29

#### Added

- Express app
- Logging middleware (Winston, Morgan)
- Health Check controller/service
- Jest setup
- Abstract Custom Error
- NotFoundError
- Error handling middleware
- Utility function (createDirIfNotExists)
- CHANGELOG and NOTES
- CircleCI pipeline
