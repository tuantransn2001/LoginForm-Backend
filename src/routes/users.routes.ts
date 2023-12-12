import express from 'express'

import {
  deleteUserByIdController,
  loginController,
  registerController,
  getUserByIdController,
  updateUserByIdController,
  uploadUserAvatarController
} from '~/controllers/users.controller'
import { uploadSingleImageMiddleware } from '~/middlewares/upload.middleware'
import {
  deleteByIdValidator,
  getUserByIdValidator,
  loginValidator,
  registerValidator,
  updateUserByIdValidator,
  uploadUserAvatarValidator
} from '~/middlewares/users.middleware'
import { wrapRequestHandler } from '~/utils/handlers'

const usersRouter = express.Router()

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
// ? ---------------------- Employee ----------------------
/**
 * @route GET /api/users?id=657181a46f8993d5fee59fbb
 * @description view employee detail
 * @query { id }
 * @access public
 */
usersRouter.get('/', getUserByIdValidator, wrapRequestHandler(getUserByIdController))
/**
 * @route PATCH /api/users
 * @description update employee detail
 * @body { extends user type }
 * @access public
 */
usersRouter.patch('/', updateUserByIdValidator, wrapRequestHandler(updateUserByIdController))
/**
 * @route POST /api/users/avatar?id=657181a46f8993d5fee59fbb
 * @description upload employee avatar
 * @body { file }
 * @query { id }
 * @access public
 */
usersRouter.post(
  '/avatar',
  uploadUserAvatarValidator,
  uploadSingleImageMiddleware('avatar', ['.png']),
  wrapRequestHandler(uploadUserAvatarController)
)
/**
 * @route DELETE /api/users?id=657181a46f8993d5fee59fbb
 * @description delete target employee
 * @query { id }
 * @access public
 */
usersRouter.delete('/', deleteByIdValidator, wrapRequestHandler(deleteUserByIdController))

export default usersRouter
