import { ParamSchema, checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
import HTTP_STATUS from '~/constants/httpStatus'
import USER_MESSAGES from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import usersService from '../services/users.services'

const passwordSchema: ParamSchema = {
  notEmpty: {
    errorMessage: USER_MESSAGES.PASSWORD_IS_REQUIRED
  },
  isLength: {
    options: {
      min: 6,
      max: 50
    },
    errorMessage: USER_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50
  },
  isStrongPassword: {
    options: {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    },
    errorMessage: USER_MESSAGES.PASSWORD_MUST_BE_STRONG
  }
}

const userPhoneExistSchema: ParamSchema = {
  custom: {
    options: async (value, { req }) => {
      const user = await usersService.checkPhoneNumberExist(value)
      const isSameUser = user && user._id.toString() === req.body.id
      if (user && !isSameUser) {
        throw new Error(USER_MESSAGES.PHONE_NUMBER_ALREADY_EXISTS)
      }
      return true
    }
  }
}

const userPhoneCorrectSchema: ParamSchema = {
  isMobilePhone: {
    options: ['vi-VN'],
    errorMessage: USER_MESSAGES.PHONE_NUMBER_IS_INVALID
  },
  trim: true
}

const userPhoneRequiredSchema: ParamSchema = {
  notEmpty: {
    errorMessage: USER_MESSAGES.PHONE_NUMBER_IS_REQUIRED
  }
}

const userLoginValidSchema: ParamSchema = {
  custom: {
    options: async (value, { req }) => {
      const user = await usersService.checkLoginValid(value, req.body.password)
      if (!user) {
        throw new ErrorWithStatus({
          status: HTTP_STATUS.BAD_REQUEST,
          message: USER_MESSAGES.PHONE_OR_PASSWORD_IS_INCORRECT
        })
      }
      req.user = user

      return true
    }
  }
}

export const loginValidator = validate(
  checkSchema(
    {
      phone_number: {
        ...userPhoneCorrectSchema,
        ...userPhoneRequiredSchema,
        ...userPhoneExistSchema,
        ...userLoginValidSchema
      },
      password: passwordSchema
    },
    ['body']
  )
)
