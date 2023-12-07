import { ObjectId } from 'mongodb'
import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

import User from '~/models/schemas/User.schema'
import USER_MESSAGES from '~/constants/messages'
import usersServices from '~/services/users.services'
import { LoginRequestBody, RegisterRequestBody, ViewProfileRequestQuery } from '~/models/requests/User.requests'

export const loginController = async (req: Request<ParamsDictionary, any, LoginRequestBody>, res: Response) => {
  const user = req.user as User
  const user_id = user._id as ObjectId
  const result = await usersServices.login(user_id.toString())
  return res.json({
    message: USER_MESSAGES.LOGIN_SUCCESS,
    result
  })
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterRequestBody>, res: Response) => {
  const result = await usersServices.register(req.body)
  return res.json({
    message: USER_MESSAGES.REGISTER_SUCCESS,
    result
  })
}

export const viewUserProfile = async (req: Request<any, any, any, ViewProfileRequestQuery>, res: Response) => {
  const result = await usersServices.findUniq(req.query.id)

  const response = {
    id: result?._id,
    city: result?.city,
    role: result?.role,
    email: result?.email,
    address: result?.address,
    name: result?.name,
    avatarUrl: result?.avatarUrl,
    phoneNumber: result?.phone_number,
    status: result?.status,
    timeline: []
  }

  return res.json({
    message: USER_MESSAGES.GET_ME_SUCCESS,
    response
  })
}
