import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import {
  CreateCustomerRequestBody,
  DeleteCustomerByIdRequestQuery,
  GetAllCustomerRequestQuery,
  GetCustomerByIdRequestQuery,
  UpdateCustomerImagesRequestQuery,
  UpdateCustomerRequestBody
} from '~/models/requests/Customer.requests'
import customersServices from '~/services/customers.services'
import USER_MESSAGES from '~/constants/messages'
import Customer, { CustomerType } from '~/models/schemas/Customer.schema'
import S3Service from '~/libs/aws/s3'
import { ObjectId } from 'mongodb'

export const getAllCustomerController = async (
  req: Request<ParamsDictionary, any, any, GetAllCustomerRequestQuery>,
  res: Response
) => {
  const response = await customersServices.findAll({
    offset: req.query.offset,
    limit: req.query.limit
  })
  return res.json({
    message: USER_MESSAGES.GET_ALL_CUSTOMER_SUCCESS,
    response
  })
}

export const getCustomerByIdController = async (
  req: Request<ParamsDictionary, any, any, GetCustomerByIdRequestQuery>,
  res: Response
) => {
  const result = await customersServices.findUniq(req.query.id)
  const response = Customer.toDto(result)
  return res.json({
    message: USER_MESSAGES.GET_CUSTOMER_SUCCESS,
    response
  })
}

export const createCustomerController = async (
  req: Request<ParamsDictionary, any, CreateCustomerRequestBody>,
  res: Response
) => {
  await customersServices.insertOne(req.body)
  return res.json({
    message: USER_MESSAGES.CREATE_CUSTOMER_SUCCESS
  })
}

export const deleteCustomerByIdController = async (
  req: Request<ParamsDictionary, any, any, DeleteCustomerByIdRequestQuery>,
  res: Response
) => {
  await customersServices.softDelete(req.query.id)
  return res.json({
    message: USER_MESSAGES.DELETE_CUSTOMER_SUCCESS
  })
}

export const updateCustomerByIdController = async (
  req: Request<ParamsDictionary, any, UpdateCustomerRequestBody>,
  res: Response
) => {
  const result = await customersServices.updateOne(req.body)
  const response = Customer.toDto(result.value)
  return res.json({
    message: USER_MESSAGES.UPDATE_CUSTOMER_SUCCESS,
    response
  })
}

export const uploadCustomerImagesController = async (
  req: Request<ParamsDictionary, any, any, UpdateCustomerImagesRequestQuery>,
  res: Response
) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] }
  const id = req.query.id as ObjectId

  const handleS3Upload = async (file: Express.Multer.File) => {
    // default size: w:490 , h:510
    const uniqFileName = file?.filename
    type UpdateCustomer = Partial<CustomerType> & { id: ObjectId }
    const updateData: UpdateCustomer = { id: new ObjectId(id) }
    await S3Service.upload(file?.path as string, uniqFileName, {
      resize: { width: 490, height: 510 }
    })
    const { signedUrl } = await S3Service.getSignUrlForFile(uniqFileName)
    if (file.fieldname === 'avatar') updateData['avatar_url'] = signedUrl
    if (file.fieldname === 'logo') updateData['company_logo'] = signedUrl

    await customersServices.updateOne(updateData)
  }

  const handleUploadAndUpdateCustomer = async () =>
    await Promise.all(Object.keys(files).map(async (key) => await handleS3Upload(files[key][0])))

  handleUploadAndUpdateCustomer()

  return res.json({
    mess: USER_MESSAGES.UPLOAD_AVATAR_SUCCESS
  })
}
