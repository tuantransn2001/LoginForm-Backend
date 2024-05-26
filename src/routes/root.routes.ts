import express from 'express'
import usersRouter from './users.routes'

const rootRouter = express.Router()

rootRouter.use('/users', usersRouter)

export default rootRouter
