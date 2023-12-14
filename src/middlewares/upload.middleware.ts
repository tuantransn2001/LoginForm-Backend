import { config } from 'dotenv'
import multer from 'multer'
import { Request } from 'express'
import { mkdirp } from 'mkdirp'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'

config()

const storage_path = process.env.IMAGE_STORAGE_PATH || ''

const handleExtractExtension = (file: Express.Multer.File) => file.originalname.slice(-4)

const handleGenerateUniqFileName = (field_name: string, extension: string) => {
  const uniqueSuffix: string = Date.now() + '-' + Math.round(Math.random() * 1e9)
  const uniqFileName = `${field_name}${uniqueSuffix}${extension}`
  return uniqFileName
}

const handleConfigStorage = (payload: { storage_path: string; extensions: string[] }) =>
  multer.diskStorage({
    destination: function (_: Request, __: Express.Multer.File, cb) {
      if (payload.storage_path.length === 0 || payload.storage_path === undefined) {
        const uploadError = new ErrorWithStatus({
          status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
          message: 'Storage path is not defined'
        })
        uploadError.name = 'Multer Error'
        cb(uploadError, payload.storage_path)
      }
      cb(null, payload.storage_path)
    },
    filename: function (_: Request, file: Express.Multer.File, cb) {
      const extension_fileName_upload: string = handleExtractExtension(file)
      const isValidExtension: boolean = payload.extensions.includes(extension_fileName_upload)
      if (isValidExtension) {
        const uniqFileName = handleGenerateUniqFileName(file.fieldname, extension_fileName_upload)
        cb(null, uniqFileName)
      } else {
        const uploadError = new ErrorWithStatus({
          status: HTTP_STATUS.BAD_REQUEST,
          message: `Extension in-valid - extension must be in: ${payload.extensions}`
        })
        uploadError.name = 'Multer Error'
        cb(uploadError, file.filename)
      }
    }
  })

export const uploadSingleImageMiddleware = (field: string, extensions: string[]) => {
  mkdirp.sync(storage_path)
  const upload = multer({ storage: handleConfigStorage({ storage_path, extensions }) })
  return upload.single(field)
}

export const uploadMultipleImagesMiddleware = (fields: multer.Field[], extensions: string[]) => {
  mkdirp.sync(storage_path)
  const upload = multer({ storage: handleConfigStorage({ storage_path, extensions }) })
  return upload.fields(fields)
}
