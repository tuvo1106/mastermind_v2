# Notes

## Todo

- Add route for scores
- Add extra difficulty

## Bugs

- ~~Delete all games associated with user on user delete~~

## Tech Debt

- fix `@ts-ignore` lines
  - `src/app.ts`
  - `src/infra/winston-config-stream.ts`
- create script to flush logs
- add authentication on GET, DELETE, PUT user routes
- add tests for GraphQL endpoints
- ~~more descriptive tests for `getCorrectPositionsAndColors`~~
- ~~do not pass back password~~
- Add error handling for axios failures in CLI
