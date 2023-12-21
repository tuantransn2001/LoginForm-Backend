import { config } from 'dotenv'
import { ObjectId } from 'mongodb'

import { signToken } from '~/utils/jwt'
import { hashPassword } from '~/utils/crypto'
import { TokenType, UserStatus } from '~/constants/enums'

import User from '~/models/schemas/User.schema'
import instanceMongodb from './database.services'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import { RegisterRequestBody, UpdateUserRequestBody } from '~/models/requests/User.requests'

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
        password_hash: hashPassword(payload.password),
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

  async refreshToken(user_id: string, refresh_token: string) {
    const [access_token, new_refresh_token] = await this.signAccessAndRefreshToken(user_id)

    await instanceMongodb.refreshToken.findOneAndUpdate(
      { token: refresh_token, user_id: new ObjectId(user_id) },
      { $set: { token: new_refresh_token } },
      { includeResultMetadata: true, returnDocument: 'after' }
    )

    return { access_token, refresh_token: new_refresh_token }
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
    const _limit = limit ? limit : 10
    const _skip = offset ? (offset - 1) * _limit : 0
    const users = await instanceMongodb.users
      .find({
        is_deleted: false
      })
      .skip(Number(_skip))
      .limit(Number(_limit))
      .toArray()
      .then((users) => users.map((user) => User.toDto(user)))
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

  async updateOne(payload: UpdateUserRequestBody) {
    const { id, ...rest } = payload

    const result = await instanceMongodb.users
      .findOneAndUpdate(
        { _id: new ObjectId(id), is_deleted: false },
        { $set: { ...rest } },
        { includeResultMetadata: true, returnDocument: 'after' }
      )
      .then(async (response) => {
        if (Object.prototype.hasOwnProperty.call(payload, 'status')) {
          const updateTimeline: { status: UserStatus; start_date: Date }[] = response.value?.time_line || []
          updateTimeline.push({
            status: response.value?.status as UserStatus,
            start_date: new Date()
          })
          return await instanceMongodb.users
            .findOneAndUpdate(
              { _id: new ObjectId(id), is_deleted: false },
              { $set: { time_line: updateTimeline } },
              { includeResultMetadata: true, returnDocument: 'after' }
            )
            .then((res) => User.toDto(res.value))
        }
      })

    return result
  }

  async checkLoginValid(phone_number: string, password: string) {
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

const usersServices = new UsersService()
export default usersServices
