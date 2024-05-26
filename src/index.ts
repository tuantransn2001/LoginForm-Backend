import express from 'express'
import cors from 'cors'
import rootRouter from './routes/root.routes'
import instanceMongodb from '~/services/database.services'
import { defaultErrorHandler } from './middlewares/error.middleware'
import { hashPassword } from './utils/crypto'

instanceMongodb.connect().catch(console.dir)

const app = express()
const port = process.env.PORT || 4000
const node_env = process.env.NODE_ENV || 'development'
const rootPath = process.env.ROOT_PATH || '/api/v1'

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  methods: 'GET,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
}

app.use(express.json())

app.use(cors(corsOptions))

app.get(rootPath, (req, res) => {
  const currentHost = req.protocol + '://' + req.get('host') + req.originalUrl
  res.status(200).send({ message: `🚀 Server is running at ${currentHost}`, environment: node_env })
})

app.get('*', (_, res) => {
  res.status(404).send({ status: 404, message: 'Page Not Found!' })
})

app.use(rootPath, rootRouter)

app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`🚀 Server started at port: ${port}\n🚨️ Environment: ${node_env}`)
})
