export const USER_MESSAGES = {
  LOGIN_SUCCESS: 'Login success',
  INTERNAL_SERVER: 'Internal server error',
  PASSWORD_IS_REQUIRED: 'Password is required',
  PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50: 'Password length must be from 6 to 50',
  VALIDATION_ERROR: 'Validation error',
  PASSWORD_MUST_BE_STRONG:
    'Password must be at least 6 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol',
  PHONE_NUMBER_ALREADY_EXISTS: 'Phone number already exists',
  PHONE_NUMBER_IS_INVALID: 'Phone number is invalid',
  PHONE_NUMBER_IS_REQUIRED: 'Phone number is required',
  PHONE_OR_PASSWORD_IS_INCORRECT: 'Phone or password is incorrect'
} as const

export default USER_MESSAGES
