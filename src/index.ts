import express from 'express'
import rootRouter from './routes/root.routes'
import instanceMongodb from '~/services/database.services'
import { defaultErrorHandler } from './middlewares/error.middleware'
import { accessTokenValidator } from './middlewares/users.middleware'

instanceMongodb.connect().catch(console.dir)

const app = express()
const port = process.env.PORT || 8002

app.use(express.json())

app.use(
  '/api',
  // accessTokenValidator
  rootRouter
)

app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
