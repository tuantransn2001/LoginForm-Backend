import express from 'express'
import usersRouter from '~/routes/users.routes'
import instanceMongodb from '~/services/database.services'
import { defaultErrorHandler } from './middlewares/error.middleware'

instanceMongodb.connect().catch(console.dir)
const app = express()
const port = 8002

app.use(express.json())
app.use('/api/users', usersRouter)

app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
