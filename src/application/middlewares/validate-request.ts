import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { logger } from '../../infra/logger/winston-config-stream'

import { RequestValidationError } from '../errors/request-validation-error'

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    errors.array().forEach((err: any) => logger.error(`${err.msg}`))
    throw new RequestValidationError(errors.array())
  }
  next()
}
