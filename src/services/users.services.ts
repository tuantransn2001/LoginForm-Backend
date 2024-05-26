import { config } from 'dotenv'
import { ObjectId } from 'mongodb'

import { signToken } from '~/utils/jwt'
import { hashPassword } from '~/utils/crypto'

import User from '~/models/schemas/User.schema'
import instanceMongodb from './database.services'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import { TokenType } from '~/constants/tokens'

config()

class UsersService {
  private signAccessToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.AccessToken
      },
      privateKey: process.env.JWT_SECRET_ACCESS_TOKEN as string,
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
      }
    })
  }

  private signRefreshToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.RefreshToken
      },
      privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string,
      options: {
        expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN
      }
    })
  }

  private signAccessAndRefreshToken(user_id: string) {
    return Promise.all([this.signAccessToken(user_id), this.signRefreshToken(user_id)])
  }

  async login(user_id: string) {
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken(user_id)
    await instanceMongodb.refreshToken.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token })
    )

    return { access_token, refresh_token }
  }

  async checkEmailExist(email: string) {
    const user = await instanceMongodb.users.findOne({ email, is_deleted: false })
    return user
  }

  async checkPhoneNumberExist(phone_number: string) {
    const user = await instanceMongodb.users.findOne({ phone_number, is_deleted: false })
    return user
  }

  async findAll({ offset, limit }: { offset?: number; limit?: number }) {
    const totalDocument = await instanceMongodb.users.countDocuments({ is_deleted: false })
    const _limit = limit ? limit : totalDocument
    const _skip = offset ? (offset - 1) * _limit : 0
    const users = await instanceMongodb.users
      .find({
        is_deleted: false
      })
      .skip(Number(_skip))
      .limit(Number(_limit))
      .toArray()
      .then(async (users) => await Promise.all(users.map((user) => User.toDto(user))))

    return users
  }

  async findUniq(_id?: ObjectId) {
    const user = await instanceMongodb.users.findOne({ _id: new ObjectId(_id), is_deleted: false })
    return user
  }

  async softDeleteOne(_id?: ObjectId) {
    const result = await instanceMongodb.users.findOneAndUpdate(
      { _id: new ObjectId(_id) },
      { $set: { is_deleted: true } },
      { includeResultMetadata: true, returnDocument: 'after' }
    )
    return result
  }

  async hardDeleteOne(_id?: ObjectId) {
    const result = await instanceMongodb.users.findOneAndDelete({
      _id: new ObjectId(_id)
    })
    return result
  }

  async checkLoginValid(phone_number: string, password: string) {
    console.log({
      phone_number,
      password,
      password_hash: hashPassword(password),
      password_from_db: await usersService.findAll({ offset: 1, limit: 100 })
    })
    const user = await instanceMongodb.users.findOne({
      phone_number,
      password_hash: hashPassword(password),
      is_deleted: false
    })
    return user
  }

  async checkRefreshTokenValid(token: string) {
    const isValid = await instanceMongodb.refreshToken.findOne({ token })
    return isValid
  }
}

const usersService = new UsersService()
export default usersService
