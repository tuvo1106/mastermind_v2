# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

#### [0.0.2] - 2021-04-30

### Added

- User controller/service/repository and tests
- Abstract Repository
- InMemoryRepository implementation
- BadRequestError and RequestValidationError
- UserFactory
- AppHealth interface
- ValidateRequest middleware
- UserEntity
- Validation middleware (express-validator)

### Changed

- Renamed various interface files
- Script names

#### [0.0.1] - 2021-04-29

### Added

- Express app
- Logging middleware (Winston, Morgan)
- Health Check controller/service
- Jest setup
- Abstract Custom Error
- NotFoundError
- Error handling middleware
- Utility function (createDirIfNotExists)
- CHANGELOG and NOTES
- Add circleci pipeline
