import { Request } from 'express'
import { capitalize } from 'lodash'
import { ParamSchema, checkSchema } from 'express-validator'
import { JsonWebTokenError } from 'jsonwebtoken'

import { verifyToken } from '~/utils/jwt'
import { validate } from '~/utils/validation'
import HTTP_STATUS from '~/constants/httpStatus'
import USER_MESSAGES from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import usersServices from '~/services/users.services'
import { UserStatus } from '~/constants/enums'

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

const confirmPasswordSchema: ParamSchema = {
  notEmpty: {
    errorMessage: USER_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED
  },
  isLength: {
    options: {
      min: 6,
      max: 50
    },
    errorMessage: USER_MESSAGES.CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50
  },
  isStrongPassword: {
    options: {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    },
    errorMessage: USER_MESSAGES.CONFIRM_PASSWORD_MUST_BE_STRONG
  },
  custom: {
    options: (value, { req }) => {
      if (value !== req.body.password) {
        throw new Error(USER_MESSAGES.CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD)
      }
      return true
    }
  }
}

const userNotFoundSchema: ParamSchema = {
  trim: true,
  notEmpty: {
    errorMessage: new ErrorWithStatus({
      status: HTTP_STATUS.BAD_REQUEST,
      message: USER_MESSAGES.USER_ID_REQUIRED
    })
  },
  custom: {
    options: async (value) => {
      const isUserExist = await usersServices.findUniq(value)

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

const userPhoneExistSchema: ParamSchema = {
  custom: {
    options: async (value) => {
      const isExistPhoneNumber = await usersServices.checkPhoneNumberExist(value)
      if (isExistPhoneNumber) {
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
      const user = await usersServices.checkLoginValid(value, req.body.password)
      if (!user) {
        throw new Error(USER_MESSAGES.EMAIL_OR_PASSWORD_IS_INCORRECT)
      }
      req.user = user

      return true
    }
  }
}

const userCorrectEmailSchema: ParamSchema = {
  isEmail: {
    errorMessage: USER_MESSAGES.EMAIL_IS_INVALID
  },
  trim: true
}

const userEmailExistSchema: ParamSchema = {
  custom: {
    options: async (value, { req }) => {
      const user = await usersServices.checkEmailExist(req.body.email)
      if (!user) {
        throw new Error(USER_MESSAGES.EMAIL_ALREADY_EXISTS)
      }
      req.user = user

      return true
    }
  }
}

export const loginValidator = validate(
  checkSchema(
    {
      email: { ...userLoginValidSchema, ...userCorrectEmailSchema },
      password: passwordSchema
    },
    ['body']
  )
)

export const registerValidator = validate(
  checkSchema(
    {
      phone_number: { ...userPhoneCorrectSchema, ...userPhoneRequiredSchema, ...userPhoneExistSchema },
      password: passwordSchema,
      confirm_password: confirmPasswordSchema
    },
    ['body']
  )
)

export const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: {
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            const access_token = (value || '').split(' ')[1]
            if (!access_token) {
              throw new ErrorWithStatus({
                status: HTTP_STATUS.UNAUTHORIZED,
                message: USER_MESSAGES.ACCESS_TOKEN_IS_REQUIRED
              })
            }

            try {
              const decoded_authorization = await verifyToken({
                token: access_token,
                secretOrPublicKey: process.env.JWT_SECRET_ACCESS_TOKEN as string
              })
              ;(req as Request).decoded_authorization = decoded_authorization
            } catch (error) {
              throw new ErrorWithStatus({
                message: capitalize((error as JsonWebTokenError).message),
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }

            return true
          }
        }
      }
    },
    ['headers']
  )
)

export const refreshTokenValidator = validate(
  checkSchema(
    {
      refresh_token: {
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: USER_MESSAGES.REFRESH_TOKEN_IS_REQUIRED,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }

            try {
              const [decoded_refresh_token, refresh_token] = await Promise.all([
                verifyToken({ token: value, secretOrPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN as string }),
                usersServices.checkRefreshTokenValid(value)
              ])

              if (!refresh_token) {
                throw new ErrorWithStatus({
                  status: HTTP_STATUS.UNAUTHORIZED,
                  message: USER_MESSAGES.USED_REFRESH_TOKEN_OR_NOT_EXIST
                })
              }

              ;(req as Request).decoded_refresh_token = decoded_refresh_token
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatus({
                  status: HTTP_STATUS.UNAUTHORIZED,
                  message: capitalize(error.message)
                })
              }

              throw error
            }

            return true
          }
        }
      }
    },
    ['body']
  )
)

export const getUserByIdValidator = validate(
  checkSchema(
    {
      id: userNotFoundSchema
    },
    ['query']
  )
)

export const deleteByIdValidator = validate(
  checkSchema(
    {
      id: userNotFoundSchema
    },
    ['query']
  )
)

export const updateUserByIdValidator = validate(
  checkSchema(
    {
      id: userNotFoundSchema,
      email: {
        optional: true,
        ...userCorrectEmailSchema,
        ...userEmailExistSchema
      },
      phone_number: { optional: true, ...userPhoneCorrectSchema, ...userPhoneExistSchema },
      status: {
        isIn: { options: [Object.values(UserStatus)] },
        errorMessage: 'Invalid status' + ' ' + 'status must: ' + Object.values(UserStatus)
      }
    },
    ['body']
  )
)

export const uploadUserAvatarValidator = validate(checkSchema({ id: userNotFoundSchema }, ['query']))
