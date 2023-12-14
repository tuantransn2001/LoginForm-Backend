import { ObjectId } from 'mongodb'
import Customer, { CustomerType } from '~/models/schemas/Customer.schema'
import instanceMongodb from './database.services'
import { UpdateCustomerRequestBody } from '~/models/requests/Customer.requests'

class CustomersService {
  async findAll({ offset, limit }: { offset?: number; limit?: number }) {
    const users = await instanceMongodb.customers
      .find({
        is_deleted: false
      })
      .skip(offset ? offset : 0)
      .limit(limit ? limit : 10)
      .toArray()
      .then((customers) => customers.map((customer) => Customer.toDto(customer)))
    return users
  }
  async insertOne(payload: CustomerType) {
    const customer_id = new ObjectId()
    const date = new Date()
    const result = await instanceMongodb.customers.insertOne(
      new Customer({
        _id: customer_id,
        ...payload,
        created_at: date,
        updated_at: date
      })
    )

    return result
  }
  async findUniq(_id?: ObjectId) {
    const user = await instanceMongodb.customers.findOne({ _id: new ObjectId(_id), is_deleted: false })
    return user
  }

  async checkEmailExist(email: string) {
    const user = await instanceMongodb.customers.findOne({ email, is_deleted: false })
    return user
  }

  async checkPhoneNumberExist(phone_number: string) {
    const user = await instanceMongodb.customers.findOne({ phone_number, is_deleted: false })
    return user
  }

  async softDelete(_id?: ObjectId) {
    const result = await instanceMongodb.customers
      .findOneAndUpdate(
        { _id: new ObjectId(_id) },
        { $set: { is_deleted: true } },
        { includeResultMetadata: true, returnDocument: 'after' }
      )
      .then((response) => Customer.toDto(response.value))
    return result
  }

  async updateOne(payload: UpdateCustomerRequestBody) {
    const { id, ...rest } = payload
    const result = await instanceMongodb.customers
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { ...rest } },
        { includeResultMetadata: true, returnDocument: 'after' }
      )
      .then((response) => Customer.toDto(response.value))

    return result
  }
}

const customersServices = new CustomersService()
export default customersServices
