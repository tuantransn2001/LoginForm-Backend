import { ObjectId } from 'mongodb'
import { UserVerifyStatus } from '~/constants/enums'

interface UserType {
  _id?: ObjectId
  city?: string
  role?: string
  email?: string
  address?: string
  name?: string
  avatarUrl?: string
  phone_number?: string
  password_hash?: string
  status?: string
  email_verify_token?: string
  forgot_password_token?: string
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
  avatarUrl?: string
  phone_number?: string
  password_hash?: string
  status?: string
  email_verify_token?: string
  forgot_password_token?: string
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
    this.avatarUrl = user.avatarUrl || ''
    this.phone_number = user.phone_number || ''
    this.password_hash = user.password_hash || ''
    this.status = user.status || ''
    this.email_verify_token = user.email_verify_token || ''
    this.forgot_password_token = user.forgot_password_token || ''
    this.verify = user.verify || UserVerifyStatus.Unverified
    this.created_at = user.created_at || date
    this.updated_at = user.updated_at || date
  }
}
