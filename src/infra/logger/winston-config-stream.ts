import appRoot from 'app-root-path'
import path from 'path'
import winston from 'winston'
import 'winston-daily-rotate-file'

import { createDirIfNotExists } from '../../application/utils/createDirIfNotExists'

const FIVE_MB = 5242880
const logDirectory = path.resolve(`${appRoot}`, 'logs')

createDirIfNotExists(logDirectory)

const options = {
  infofile: {
    level: 'info',
    filename: path.resolve(logDirectory, 'application-%DATE%-info.log'),
    handleExceptions: true,
    json: true,
    maxsize: FIVE_MB,
    maxFiles: 5,
  },
  errorfile: {
    level: 'error',
    filename: path.resolve(logDirectory, 'application-%DATE%-error.log'),
    handleExceptions: true,
    json: true,
    maxsize: FIVE_MB,
    maxFiles: 5,
  },
  console: {
    level: 'info',
    handleExceptions: true,
    format: winston.format.simple(),
  },
}

const logger = winston.createLogger({
  transports: [
    new winston.transports.DailyRotateFile(options.infofile),
    new winston.transports.DailyRotateFile(options.errorfile),
    new winston.transports.Console(options.console),
  ],
})

logger.stream = {
  // @ts-ignore
  write: function (message, encoding) {
    logger.info(message)
  },
}

export { logger }
