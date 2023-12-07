import express from 'express'

import { loginController, registerController } from '~/controllers/users.controller'
import { loginValidator, registerValidator } from '~/middlewares/users.middleware'
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
 * @body {phone_number: string, password: string, comfirm_password: string }
 * @access public
 */
usersRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

export default usersRouter
