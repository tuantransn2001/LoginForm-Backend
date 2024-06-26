import { ObjectId } from 'mongodb'
import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import User from '~/models/schemas/User.schema'
import USER_MESSAGES from '~/constants/messages'
import usersServices from '~/services/users.services'
import { LoginRequestBody } from '~/models/requests/User.requests'

export const loginController = async (req: Request<ParamsDictionary, any, LoginRequestBody>, res: Response) => {
  const user = req.user as User
  const user_id = user._id as ObjectId
  const result = await usersServices.login(user_id.toString())
  return res.json({
    message: USER_MESSAGES.LOGIN_SUCCESS,
    response: result
  })
}
