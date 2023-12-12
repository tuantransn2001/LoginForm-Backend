import { ObjectId } from 'mongodb'
import { UserStatus, UserVerifyStatus } from '~/constants/enums'

export interface UserType {
  _id?: ObjectId
  city?: string
  role?: string
  email?: string
  address?: string
  name?: string
  avatar_url?: string
  phone_number?: string
  password_hash?: string
  email_verify_token?: string
  forgot_password_token?: string
  status?: UserStatus
  verify?: UserVerifyStatus
  created_at?: Date
  updated_at?: Date
}

export default class User {
  _id?: ObjectId
  city?: string
  role?: string
  email?: string
  address?: string
  name?: string
  avatar_url?: string
  phone_number?: string
  password_hash?: string
  email_verify_token?: string
  forgot_password_token?: string
  status?: UserStatus
  verify?: UserVerifyStatus
  created_at?: Date
  updated_at?: Date

  constructor(user: UserType) {
    const date = new Date()

    this._id = user._id
    this.city = user.city || ''
    this.role = user.role || ''
    this.email = user.email || ''
    this.address = user.address || ''
    this.name = user.name || ''
    this.avatar_url = user.avatar_url || ''
    this.phone_number = user.phone_number || ''
    this.password_hash = user.password_hash || ''
    this.email_verify_token = user.email_verify_token || ''
    this.forgot_password_token = user.forgot_password_token || ''
    this.verify = user.verify || UserVerifyStatus.Unverified
    this.status = user.status || UserStatus.Official
    this.created_at = user.created_at || date
    this.updated_at = user.updated_at || date
  }

  static toDto(user?: UserType | null) {
    return {
      id: user?._id || '',
      city: user?.city || '',
      role: user?.role || '',
      email: user?.email || '',
      address: user?.address || '',
      name: user?.name || '',
      avatar_url: user?.avatar_url || '',
      phone_number: user?.phone_number || '',
      status: user?.status || ''
    }
  }
}
