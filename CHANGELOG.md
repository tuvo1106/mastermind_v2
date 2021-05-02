# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

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
