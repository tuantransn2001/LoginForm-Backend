// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import { config } from 'dotenv'
import * as fs from 'fs'
import * as AWS from 'aws-sdk'
import sharp from 'sharp'

config()

class AWSS3 {
  private config: AWS.S3.ClientConfiguration
  private s3: AWS.S3

  constructor() {
    this.config = {
      apiVersion: '2006-03-01',
      accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
      region: process.env.AWS_S3_REGION
    }

    this.s3 = new AWS.S3(this.config)
  }

  upload(
    filepath: string,
    name: string,
    options?: { resize?: { width: number; height: number } }
  ): Promise<{ filepath: string; data: AWS.S3.PutObjectOutput[] }> {
    return new Promise((resolve, reject) => {
      // check if file exists
      if (fs.existsSync(filepath)) {
        const res: { filepath: string; data: AWS.S3.PutObjectOutput[] } = {
          filepath: filepath,
          data: []
        }
        // upload file
        const fileBinaryString = fs.readFileSync(filepath, null)
        const params: AWS.S3.PutObjectRequest = {
          Body: fileBinaryString,
          Bucket: process.env.AWS_S3_BUCKET_NAME as string,
          Key: name
        }

        this.s3.putObject(params, (e, d) => {
          if (e) {
            reject(e)
          }

          d.name = name
          res.data.push(d)

          // check if we should create a resized copy of the uploaded file
          if (
            options &&
            options.resize &&
            typeof options.resize.width === 'number' &&
            typeof options.resize.height === 'number'
          ) {
            const width = options.resize.width
            const height = options.resize.height

            // resize image and upload to S3
            // won't be creating any temporary files
            sharp(filepath)
              .resize(width, height)
              .toBuffer()
              .then((buffer) => {
                params.Body = buffer

                params.Key = width + '-' + height + '-' + params.Key

                this.s3.putObject(params, (e, d) => {
                  if (e) {
                    reject(e)
                  }

                  d.name = params.Key

                  res.data.push(d)
                  resolve(res)
                })
              })
              .catch((e) => reject(e))
          } else {
            resolve(res)
          }
        })
      } else {
        reject('File ' + filepath + ' does not exist')
      }
    })
  }
}

export default new AWSS3()
