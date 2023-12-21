import { ParamSchema, checkSchema } from 'express-validator'
import { CustomerTitle } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import USER_MESSAGES from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import customersServices from '~/services/customers.services'
import { validate } from '~/utils/validation'

const customerIdRequiredSchema: ParamSchema = {
  notEmpty: {
    errorMessage: new ErrorWithStatus({
      status: HTTP_STATUS.BAD_REQUEST,
      message: USER_MESSAGES.USER_ID_REQUIRED
    })
  }
}

const customerNotFoundSchema: ParamSchema = {
  trim: true,
  custom: {
    options: async (value) => {
      const isUserExist = await customersServices.findUniq(value)

      if (!isUserExist) {
        throw new ErrorWithStatus({
          status: HTTP_STATUS.NOT_FOUND,
          message: USER_MESSAGES.USER_NOT_FOUND
        })
      }

      return true
    }
  }
}

const customerPhoneCorrectSchema: ParamSchema = {
  isMobilePhone: {
    options: ['vi-VN'],
    errorMessage: USER_MESSAGES.PHONE_NUMBER_IS_INVALID
  }
}

const customerPhoneRequiredSchema: ParamSchema = {
  notEmpty: {
    errorMessage: USER_MESSAGES.PHONE_NUMBER_IS_REQUIRED
  }
}
const customerPhoneExistSchema: ParamSchema = {
  custom: {
    options: async (_, { req }) => {
      const user = await customersServices.checkPhoneNumberExist(req.body.phone_number)
      if (user) {
        throw new Error(USER_MESSAGES.PHONE_NUMBER_ALREADY_EXISTS)
      }

      return true
    }
  }
}
const customerEmailExistSchema: ParamSchema = {
  custom: {
    options: async (_, { req }) => {
      const user = await customersServices.checkEmailExist(req.body.email)
      if (user) {
        throw new Error(USER_MESSAGES.EMAIL_ALREADY_EXISTS)
      }

      return true
    }
  }
}
const customerEmailCorrectSchema: ParamSchema = {
  isEmail: {
    errorMessage: USER_MESSAGES.EMAIL_IS_INVALID
  }
}
const customerEmailRequiredSchema: ParamSchema = {
  notEmpty: {
    errorMessage: USER_MESSAGES.EMAIL_IS_REQUIRED
  }
}
export const createCustomerValidator = validate(
  checkSchema({
    name: {
      notEmpty: {
        errorMessage: USER_MESSAGES.NAME_IS_REQUIRED
      }
    },
    phone_number: { ...customerPhoneRequiredSchema, ...customerPhoneCorrectSchema, ...customerPhoneExistSchema },
    email: {
      ...customerEmailRequiredSchema,
      ...customerEmailCorrectSchema,
      ...customerEmailExistSchema
    },
    company_name: {
      notEmpty: {
        errorMessage: USER_MESSAGES.COMPANY_NAME_IS_REQUIRED
      }
    }
  })
)

export const getCustomerByIdValidator = validate(
  checkSchema(
    {
      id: { ...customerIdRequiredSchema, ...customerNotFoundSchema }
    },
    ['query']
  )
)

export const deleteCustomerByIdValidator = validate(
  checkSchema(
    {
      id: { ...customerIdRequiredSchema, ...customerNotFoundSchema }
    },
    ['query']
  )
)

export const updateCustomerByIdValidator = validate(
  checkSchema(
    {
      id: { ...customerIdRequiredSchema, ...customerNotFoundSchema },
      phone_number: { optional: true, ...customerPhoneCorrectSchema, ...customerPhoneExistSchema },
      email: { optional: true, ...customerEmailCorrectSchema, ...customerEmailExistSchema },
      title: {
        isIn: { options: [Object.keys(CustomerTitle)] },
        errorMessage: 'Invalid title' + ' ' + 'title must: ' + Object.keys(CustomerTitle)
      }
    },
    ['body']
  )
)

export const customerUploadExistValidator = validate(
  checkSchema({ id: { ...customerIdRequiredSchema, ...customerNotFoundSchema } }, ['query'])
)

export const customerUploadMultipleFileValidator = validate(
  checkSchema(
    {
      files: {
        custom: {
          options: async (_, { req }) => {
            if (!req.files || req.files.length === 0) {
              throw new ErrorWithStatus({
                status: HTTP_STATUS.BAD_REQUEST,
                message: USER_MESSAGES.PLEASE_UPLOAD_AT_LEAST_ONE_FILE
              })
            }
            Object.keys(req.files as { [fieldname: string]: Express.Multer.File[] }).forEach((k) => {
              const file = (req.files as { [fieldname: string]: Express.Multer.File[] })[k][0]
              if (!file.mimetype.startsWith('image/')) {
                throw new ErrorWithStatus({
                  status: HTTP_STATUS.BAD_REQUEST,
                  message: USER_MESSAGES.PLEASE_UPLOAD_ONLY_IMAGE_FILES
                })
              }
            })

            return true
          }
        }
      }
    },

    ['body']
  )
)

export const getAllCustomerValidator = validate(
  checkSchema(
    {
      offset: { optional: true, isNumeric: true, errorMessage: USER_MESSAGES.OFFSET_MUST_BE_A_NUMBER },
      limit: { optional: true, isNumeric: true, errorMessage: USER_MESSAGES.LIMIT_MUST_BE_A_NUMBER }
    },
    ['query']
  )
)
