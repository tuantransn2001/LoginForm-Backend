import dotenv from 'dotenv'

dotenv.config()

type EnvType = 'development' | 'production'

const dbConnectionString = {
  development: process.env.DB_URI_DEV || '',
  production: `mongodb://${process.env.DB_USERNAME_PROD}:${process.env.DB_PASSWORD_PROD}@${process.env.DB_HOST_PROD}:${process.env.DB_PORT_PROD}/${process.env.DB_NAME_PROD}`
}

export const uri = dbConnectionString[process.env.NODE_ENV as EnvType]
