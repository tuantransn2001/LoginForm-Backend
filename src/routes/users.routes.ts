import express from 'express'
import { loginController } from '~/controllers/users.controller'
import { loginValidator } from '~/middlewares/users.middleware'
import { wrapRequestHandler } from '~/utils/handlers'

const usersRouter = express.Router()

/**
 * @route POST /api/users/login
 * @description customer login
 * @body {phone_number: string, password: string}
 * @access public
 */
usersRouter.post('/login', loginValidator, wrapRequestHandler(loginController))

export default usersRouter
