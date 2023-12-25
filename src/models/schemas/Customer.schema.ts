import { ObjectId } from 'mongodb'
import { CustomerStatus, CustomerTitle } from '~/constants/enums'

export interface CustomerType {
  _id?: ObjectId
  avatar_url?: string
  company_logo?: string
  title?: CustomerTitle | null
  status?: CustomerStatus | null
  name?: string
  role?: string
  phone_number?: string
  email?: string
  company_name?: string
  company_address?: string
  company_description?: string
  company_model?: string
  is_deleted?: boolean
  created_at?: Date | string
  updated_at?: Date | string
}

export default class Customer {
  _id?: ObjectId
  avatar_url?: string
  company_logo?: string
  title?: CustomerTitle | null
  status?: CustomerStatus | null
  name?: string
  role?: string
  phone_number?: string
  email?: string
  company_name?: string
  company_address?: string
  company_description?: string
  company_model?: string
  is_deleted?: boolean
  created_at?: Date | string
  updated_at?: Date | string

  constructor(customer: CustomerType) {
    const date = new Date()

    this._id = customer._id
    this.avatar_url = customer.avatar_url || ''
    this.company_logo = customer.company_logo || ''
    this.title = customer.title
    this.name = customer.name || ''
    this.role = customer.role || ''
    this.phone_number = customer.phone_number || ''
    this.email = customer.email || ''
    this.company_name = customer.company_name || ''
    this.company_address = customer.company_address || ''
    this.company_description = customer.company_description || ''
    this.company_model = customer.company_model || ''
    this.status = customer.status || CustomerStatus.Active
    this.is_deleted = customer.is_deleted || false
    this.created_at = customer.created_at || date
    this.updated_at = customer.updated_at || date
  }

  static toDto(customer?: CustomerType | null): CustomerType | object {
    if (!customer) return {}
    return {
      _id: customer._id,
      avatar_url: customer.avatar_url,
      company_logo: customer.company_logo,
      title: customer.title,
      status: customer.status,
      name: customer.name,
      role: customer.role,
      phone_number: customer.phone_number,
      email: customer.email,
      company_name: customer.company_name,
      company_address: customer.company_address,
      company_description: customer.company_description,
      company_model: customer.company_model,
      created_at: customer.created_at,
      updated_at: customer.updated_at
    }
  }
}
