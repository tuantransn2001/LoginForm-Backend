import { JwtPayload } from 'jsonwebtoken'
import { ObjectId } from 'mongodb'
import { TokenType } from '~/constants/enums'
import { UserType } from '../schemas/User.schema'

export interface RegisterRequestBody {
  name: string
  password: string
  confirm_password: string
  date_of_birth: Date
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

export interface GetAllUserRequestQuery {
  offset?: number
  limit?: number
}

export interface GetUserByIdRequest {
  id?: ObjectId
}

export interface DeleteUserByIdRequestQuery extends GetUserByIdRequest {}

export interface UpdateUserRequestBody
  extends Partial<
    Omit<UserType, '_id' | 'password_hash' | 'email_verify_token' | 'forgot_password_token' | 'verify' | 'updated_at'>
  > {
  id: ObjectId
}

export interface UploadUserAvatarRequestQuery extends GetUserByIdRequest {}
