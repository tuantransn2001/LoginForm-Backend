import { JwtPayload } from 'jsonwebtoken'
import { ObjectId } from 'mongodb'
import { TokenType } from '~/constants/enums'

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

export interface ViewProfileRequestQuery {
  id?: ObjectId
}
