import { ObjectId } from 'mongodb'
import { UserDepartment, UserRole, UserStatus, UserVerifyStatus } from '~/constants/enums'

export interface UserType {
  _id?: ObjectId
  name?: string
  gender?: boolean | null
  date_of_birth?: Date
  address?: string
  phone_number?: string
  email?: string
  citizen_identification?: string
  birth_place?: string
  educational_background?: string
  role?: UserRole
  time_line?: { status: UserStatus; start_date: Date }[]
  avatar_url?: string
  status?: UserStatus | null
  password_hash?: string
  email_verify_token?: string
  forgot_password_token?: string
  verify?: UserVerifyStatus
  department?: UserDepartment | null
  contract?: string
  contract_type?: string
  health_insurance?: boolean
  social_insurance?: boolean
  support?: boolean
  is_deleted?: boolean
  created_at?: Date
  updated_at?: Date
}

export default class User {
  _id?: ObjectId
  name?: string
  gender?: boolean | null
  date_of_birth?: Date
  address?: string
  phone_number?: string
  email?: string
  citizen_identification?: string
  birth_place?: string
  educational_background?: string
  role?: UserRole
  time_line?: { status: UserStatus; start_date: Date }[]
  avatar_url?: string
  status?: UserStatus | null
  password_hash?: string
  email_verify_token?: string
  forgot_password_token?: string
  verify?: UserVerifyStatus
  department?: UserDepartment | null
  contract?: string
  contract_type?: string
  health_insurance?: boolean
  social_insurance?: boolean
  support?: boolean
  is_deleted?: boolean
  created_at?: Date
  updated_at?: Date

  constructor(user: UserType) {
    const date = new Date()

    this._id = user._id
    this.name = user.name || ''
    this.gender = user.gender
    this.date_of_birth = user.date_of_birth || date
    this.address = user.address || ''
    this.phone_number = user.phone_number || ''
    this.email = user.email || ''
    this.citizen_identification = user.citizen_identification || ''
    this.birth_place = user.birth_place || ''
    this.educational_background = user.educational_background || ''
    this.role = user.role
    this.time_line = user.time_line || []
    this.avatar_url = user.avatar_url || ''
    this.password_hash = user.password_hash || ''
    this.email_verify_token = user.email_verify_token || ''
    this.forgot_password_token = user.forgot_password_token || ''
    this.verify = user.verify || UserVerifyStatus.Unverified
    this.department = user.department
    this.contract = user.contract || ''
    this.contract_type = user.contract_type || ''
    this.health_insurance = user.health_insurance || false
    this.social_insurance = user.social_insurance || false
    this.support = user.support || false
    this.status = user.status
    this.is_deleted = user.is_deleted || false
    this.created_at = user.created_at || date
    this.updated_at = user.updated_at || date
  }

  static toDto(user?: UserType | null): UserType | object {
    if (!user) return {}
    return {
      id: user._id,
      name: user.name,
      gender: user.gender === null ? null : user.gender ? 'Nam' : 'Nữ',
      date_of_birth: user.date_of_birth,
      address: user.address,
      phone_number: user.phone_number,
      email: user.email,
      citizen_identification: user.citizen_identification,
      role: user.role,
      avatar_url: user.avatar_url,
      birth_place: user.birth_place,
      educational_background: user.educational_background,
      department: user.department,
      contract: user.contract,
      contract_type: user.contract_type,
      health_insurance: user.health_insurance,
      social_insurance: user.social_insurance,
      support: user.support,
      status: user.status,
      time_line: user.time_line
    }
  }
}
