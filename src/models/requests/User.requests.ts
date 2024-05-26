import { JwtPayload } from 'jsonwebtoken'
import { TokenType } from '~/constants/tokens'

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
