import dotenv from 'dotenv'

dotenv.config()

type EnvType = 'development' | 'production'

const dbConnectionString = {
  development: process.env.DB_URI_DEV || '',
  production: process.env.DB_URI_PROD || ''
}

export const uri = dbConnectionString[process.env.NODE_ENV as EnvType]
