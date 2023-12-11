import { ObjectId } from 'mongodb'
import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import User from '~/models/schemas/User.schema'
import USER_MESSAGES from '~/constants/messages'
import usersServices from '~/services/users.services'
import {
  LoginRequestBody,
  RegisterRequestBody,
  GetUserByIdRequestQuery,
  UpdateUserRequestBody,
  UploadUserAvatarRequestQuery
} from '~/models/requests/User.requests'
import S3Service from '~/libs/aws/s3'

export const loginController = async (req: Request<ParamsDictionary, any, LoginRequestBody>, res: Response) => {
  const user = req.user as User
  const user_id = user._id as ObjectId
  const result = await usersServices.login(user_id.toString())
  return res.json({
    message: USER_MESSAGES.LOGIN_SUCCESS,
    response: result
  })
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterRequestBody>, res: Response) => {
  const result = await usersServices.register(req.body)
  return res.json({
    message: USER_MESSAGES.REGISTER_SUCCESS,
    response: result
  })
}

export const getUserByIdController = async (req: Request<any, any, any, GetUserByIdRequestQuery>, res: Response) => {
  const result = await usersServices.findUniq(req.query.id)

  const response = {
    ...User.toDto(result),
    timeline: []
  }

  return res.json({
    message: USER_MESSAGES.GET_ME_SUCCESS,
    response
  })
}

export const updateUserByIdController = async (
  req: Request<ParamsDictionary, any, UpdateUserRequestBody>,
  res: Response
) => {
  const result = await usersServices.updateOne(req.body)

  return res.json({
    message: USER_MESSAGES.UPDATE_USER_SUCCESS,
    response: result
  })
}

export const deleteUserByIdController = async (req: Request<any, any, any, GetUserByIdRequestQuery>, res: Response) => {
  await usersServices.hardDeleteOne(req.query.id)

  return res.json({
    message: USER_MESSAGES.DELETE_USER_SUCCESS
  })
}

export const uploadUserAvatarController = async (
  req: Request<any, any, any, UploadUserAvatarRequestQuery>,
  res: Response
) => {
  // default size: w:490 , h:510
  const uniqFileName = req.file?.filename

  await S3Service.upload(req.file?.path as string, uniqFileName, {
    resize: { width: 490, height: 510 }
  })
  const { signedUrl } = await S3Service.getSignUrlForFile(uniqFileName)

  const updatedUser = await usersServices.updateOne({ id: new ObjectId(req.query.id), avatar_url: signedUrl })

  return res.json({
    mess: USER_MESSAGES.UPLOAD_AVATAR_SUCCESS,
    response: updatedUser
  })
}
