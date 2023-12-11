import { JwtPayload } from 'jsonwebtoken'
import { ObjectId } from 'mongodb'
import { TokenType } from '~/constants/enums'
import { UserType } from '../schemas/User.schema'

export interface RegisterRequestBody {
  name: string
  password: string
  confirm_password: string
  date_of_birth: string
  phone_number: string
}

export interface LoginRequestBody {
  email: string
  password: string
}

export interface LogoutRequestBody {
  refresh_token: string
}

export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenType
}

export interface GetUserByIdRequestQuery {
  id?: ObjectId
}

export interface DeleteUserByIdRequestQuery extends GetUserByIdRequestQuery {}

export interface UpdateUserRequestBody
  extends Partial<Omit<UserType, '_id' | 'password_hash' | 'email_verify_token' | 'forgot_password_token' | 'verify'>> {
  id: ObjectId
}

export interface UploadUserAvatarRequestQuery extends GetUserByIdRequestQuery {}
