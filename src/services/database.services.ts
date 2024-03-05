import { config } from 'dotenv'
import { Collection, Db, MongoClient } from 'mongodb'
import RefreshToken from '~/models/schemas/RefreshToken.schema'

import User from '~/models/schemas/User.schema'
import Customer from '~/models/schemas/Customer.schema'
import { uri } from '~/configs/db'

config()

class Database {
  private client: MongoClient
  private db: Db
  private static _instance: Database

  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(process.env.DB_NAME)
  }

  async connect() {
    try {
      // Send a ping to confirm a successful connection
      await this.client.db('admin').command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.log(error)
    } finally {
      // await this.client.close()
    }
  }

  static getInstance() {
    Database._instance = Database._instance || new Database()
    return Database._instance
  }

  get users(): Collection<User> {
    return this.db.collection(process.env.DB_USER_COLLECTION as string)
  }

  get customers(): Collection<Customer> {
    return this.db.collection(process.env.DB_CUSTOMER_COLLECTION as string)
  }

  get refreshToken(): Collection<RefreshToken> {
    return this.db.collection(process.env.DB_REFRESH_TOKEN_COLLECTION as string)
  }
}

const instanceMongodb = Database.getInstance()
export default instanceMongodb
