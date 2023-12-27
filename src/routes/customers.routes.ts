import express from 'express'
import {
  createCustomerController,
  deleteCustomerByIdController,
  getAllCustomerController,
  getCustomerByIdController,
  updateCustomerByIdController,
  uploadCustomerImagesController
} from '~/controllers/customers.controller'
import {
  createCustomerValidator,
  customerUploadExistValidator,
  customerUploadMultipleFileValidator,
  deleteCustomerByIdValidator,
  getAllCustomerValidator,
  getCustomerByIdValidator,
  updateCustomerByIdValidator
} from '~/middlewares/customers.middleware'
import { uploadMultipleImagesMiddleware } from '~/middlewares/upload.middleware'
import { wrapRequestHandler } from '~/utils/handlers'

const customersRouter = express.Router()

/**
 * @route GET /api/customers
 * @description get customer list
 * @query { id }
 * @access public
 */
customersRouter.get('/', getAllCustomerValidator, wrapRequestHandler(getAllCustomerController))
/**
 * @route GET /api/customers/get-by-id?id=657181a46f8993d5fee59fbb
 * @description get customer by id
 * @query { id }
 * @access public
 */
customersRouter.get('/get-by-id', getCustomerByIdValidator, wrapRequestHandler(getCustomerByIdController))
/**
 * @route POST /api/customers
 * @description create new customer
 * @body { extends customer type }
 * @access public
 */
customersRouter.post('/', createCustomerValidator, wrapRequestHandler(createCustomerController))
/**
 * @route DELETE /api/customers
 * @description delete customer by id
 * @query { id }
 * @access public
 */
customersRouter.delete('/', deleteCustomerByIdValidator, wrapRequestHandler(deleteCustomerByIdController))
/**
 * @route PATCH /api/users
 * @description update user detail
 * @body { extends user type }
 * @access public
 */
customersRouter.patch('/', updateCustomerByIdValidator, wrapRequestHandler(updateCustomerByIdController))
/**
 * @route POST /api/users
 * @description upload customer image
 * @query { id }
 * @body { files }
 * @access public
 */
customersRouter.post(
  '/upload/',
  customerUploadExistValidator,
  uploadMultipleImagesMiddleware(
    [
      {
        name: 'avatar',
        maxCount: 1
      },
      {
        name: 'logo',
        maxCount: 1
      }
    ],
    ['.png', '.jpeg']
  ),
  customerUploadMultipleFileValidator,
  wrapRequestHandler(uploadCustomerImagesController)
)

export default customersRouter
