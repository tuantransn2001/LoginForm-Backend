import express from 'express'
import cors from 'cors'
import rootRouter from './routes/root.routes'
import instanceMongodb from '~/services/database.services'
import { defaultErrorHandler } from './middlewares/error.middleware'
import { accessTokenValidator } from './middlewares/users.middleware'

instanceMongodb.connect().catch(console.dir)

const app = express()
const port = process.env.PORT || 8002
const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  methods: 'GET,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
}

app.use(express.json())

app.use(cors(corsOptions))

app.use('/api', accessTokenValidator, rootRouter)

app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
