import { ObjectId } from 'mongodb'
import { CustomerType } from '../schemas/Customer.schema'

export interface GetCustomerByIdRequestQuery {
  id?: ObjectId
}

export interface GetAllCustomerRequestQuery {
  offset?: number
  limit?: number
}

export interface CreateCustomerRequestBody extends CustomerType {}

export interface UpdateCustomerRequestBody extends Partial<Omit<CustomerType, '_id'>> {
  id: ObjectId
}

export interface DeleteCustomerByIdRequestQuery extends GetCustomerByIdRequestQuery {}

export interface UpdateCustomerImagesRequestQuery extends GetCustomerByIdRequestQuery {}
