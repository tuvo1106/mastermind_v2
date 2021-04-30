import fs from 'fs'

const createDirIfNotExists = (logDirectory: string) => {
  fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
}

export { createDirIfNotExists }
