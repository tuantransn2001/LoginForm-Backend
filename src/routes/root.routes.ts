import express from 'express'
import usersRouter from './users.routes'
import customersRouter from './customers.routes'

const rootRouter = express.Router()

rootRouter.use('/users', usersRouter).use('/customers', customersRouter)

export default rootRouter
