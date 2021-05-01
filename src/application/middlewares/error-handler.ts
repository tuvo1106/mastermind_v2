import { Request, Response, NextFunction } from 'express'

import { CustomError } from '../errors/custom-error.interface'

import { logger } from '../../infra/logger/winston-config-stream'

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    logger.error({ message: err.message })
    return res.status(err.statusCode).send({ errors: err.serializeErrors() })
  }
  res.status(400).send({
    errors: [{ message: 'Something went wrong.' }],
  })
}
