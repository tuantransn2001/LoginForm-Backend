import { config } from 'dotenv'
import { ObjectId } from 'mongodb'

import { signToken } from '~/utils/jwt'
import { hashPassword } from '~/utils/crypto'
import { TokenType } from '~/constants/enums'

import User from '~/models/schemas/User.schema'
import instanceMongodb from './database.services'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import { RegisterRequestBody } from '~/models/requests/User.requests'

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

  async register(payload: RegisterRequestBody) {
    const user_id = new ObjectId()
    await instanceMongodb.users.insertOne(
      new User({
        ...payload,
        _id: user_id,
        password: hashPassword(payload.password),
        phone_number: payload.phone_number
      })
    )

    const [access_token, refresh_token] = await this.signAccessAndRefreshToken(user_id.toString())
    await instanceMongodb.refreshToken.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token })
    )

    return { access_token, refresh_token }
  }

  async login(user_id: string) {
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken(user_id)
    await instanceMongodb.refreshToken.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token })
    )

    return { access_token, refresh_token }
  }

  async checkEmailExist(email: string) {
    const user = await instanceMongodb.users.findOne({ email })
    return user
  }

  async checkPhoneNumberExist(phone_number: string) {
    const user = await instanceMongodb.users.findOne({ phone_number })
    return user
  }

  async checkLoginValid(email: string, password: string) {
    const user = await instanceMongodb.users.findOne({ email, password: hashPassword(password) })
    return user
  }

  async checkRefreshTokenValid(token: string) {
    const isValid = await instanceMongodb.refreshToken.findOne({ token })
    return isValid
  }
}

const usersServices = new UsersService()
export default usersServices
