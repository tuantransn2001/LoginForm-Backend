import express from 'express'

import {
  deleteUserByIdController,
  loginController,
  registerController,
  getUserByIdController,
  updateUserByIdController,
  uploadUserAvatarController,
  getMeController,
  getAllUserController,
  refreshTokenController
} from '~/controllers/users.controller'
import { uploadSingleImageMiddleware } from '~/middlewares/upload.middleware'
import {
  deleteByIdValidator,
  getUserByIdValidator,
  loginValidator,
  registerValidator,
  updatePartitionUserByIdValidator,
  userUploadSingleFileExistValidator,
  userUploadExistValidator,
  getAllUserValidator,
  refreshTokenValidator,
  updateGlobalUserByIdValidator
} from '~/middlewares/users.middleware'
import { wrapRequestHandler } from '~/utils/handlers'

const usersRouter = express.Router()

/**
 * @route GET /api/users/me
 * @description get current user login
 * @headers { Authorization: {{token}} }
 * @access public
 */
usersRouter.get('/me', wrapRequestHandler(getMeController))
/**
 * @route POST /api/users/login
 * @description customer login
 * @body {email: string, password: string}
 * @access public
 */
usersRouter.post('/login', loginValidator, wrapRequestHandler(loginController))
/**
 * @route POST /api/users/register
 * @description customer register
 * @body {phone_number: string, password: string, confirm_password: string }
 * @access public
 */
usersRouter.post('/register', registerValidator, wrapRequestHandler(registerController))
/**
 * @route POST /api/users/refresh
 * @description refresh token
 * @headers { Authorization: {{token}} }
 * @access public
 */
usersRouter.post('/refresh-token', refreshTokenValidator, wrapRequestHandler(refreshTokenController))
// ? ---------------------- Employee ----------------------
/**
 * @route GET /api/users
 * @description view user detail
 * @query { id }
 * @access public
 */
usersRouter.get('/', getAllUserValidator, wrapRequestHandler(getAllUserController))
/**
 * @route GET /api/users/get-by-id?id=657181a46f8993d5fee59fbb
 * @description view user detail
 * @query { id }
 * @access public
 */
usersRouter.get('/get-by-id', getUserByIdValidator, wrapRequestHandler(getUserByIdController))
/**
 * @route PATCH /api/users
 * @description update user detail
 * @body { extends user type }
 * @access public
 */
usersRouter.patch('/', updatePartitionUserByIdValidator, wrapRequestHandler(updateUserByIdController))
/**
 * @route PUTß /api/users
 * @description update user detail
 * @body { extends user type }
 * @access public
 */
usersRouter.put('/', updateGlobalUserByIdValidator, wrapRequestHandler(updateUserByIdController))
/**
 * @route POST /api/users/avatar?id=657181a46f8993d5fee59fbb
 * @description upload user avatar
 * @body { file }
 * @query { id }
 * @access public
 */
usersRouter.post(
  '/avatar',
  userUploadExistValidator,
  uploadSingleImageMiddleware('avatar', ['.png', '.jpeg']),
  userUploadSingleFileExistValidator,
  wrapRequestHandler(uploadUserAvatarController)
)
/**
 * @route DELETE /api/users?id=657181a46f8993d5fee59fbb
 * @description delete target user
 * @query { id }
 * @access public
 */
usersRouter.delete('/', deleteByIdValidator, wrapRequestHandler(deleteUserByIdController))

export default usersRouter
