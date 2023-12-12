import { Request } from 'express'
import multer from 'multer'
import { mkdirp } from 'mkdirp'

export const uploadSingleImageMiddleware = (storageFolderName: string, extensions: string[]) => {
  // * The <NAME> you use in multer's upload.single(<NAME>) function must be the same as the one you use in <input type="file" name="<NAME>" ...>.
  // ? Where file is saved
  const storagePath: string = `./public/img/${storageFolderName}/`
  // ? Create folder where the image is
  mkdirp.sync(storagePath)

  const myCustomStorage = multer.diskStorage({
    destination: function (_: Request, __: Express.Multer.File, cb) {
      cb(null, `./public/img/${storageFolderName}/`)
    },
    filename: function (_: Request, file: Express.Multer.File, cb) {
      const extensionFileNameUpload: string = file.originalname.slice(-4)
      const isValidExtension: boolean = extensions.includes(extensionFileNameUpload)
      if (isValidExtension) {
        // ? Extension valid
        const uniqueSuffix: string = Date.now() + '-' + Math.round(Math.random() * 1e9)
        // ? Full Img name
        const completeFileName = `${file.fieldname}${uniqueSuffix}${extensionFileNameUpload}`

        cb(null, completeFileName)
      } else {
        // ! Extension in-valid
        cb(new Error('Extension in-valid'), file.filename)
      }
    }
  })

  const upload = multer({ storage: myCustomStorage })

  return upload.single(storageFolderName)
}
