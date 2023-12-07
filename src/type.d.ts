import e, { Request, Response, NextFunction } from 'express'
import User from './models/schemas/User.schema'
import { TokenPayload } from './models/requests/User.requests'

export interface ICallBack {
  req: Request
  res: Response
  next: NextFunction
}

declare module 'express' {
  interface Request {
    user?: User
    decoded_authorization?: TokenPayload
    decoded_refresh_token?: TokenPayload
    decoded_email_verify_token?: TokenPayload
    decoded_forgot_password_token?: TokenPayload
  }
}

export type ISmsOptions = {
  to: string
  body: string
}
