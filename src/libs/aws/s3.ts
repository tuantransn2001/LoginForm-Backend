// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import { config } from 'dotenv'
import * as fs from 'fs'
import * as AWS from 'aws-sdk'
import sharp from 'sharp'
import * as path from 'path'

config()

class AWSS3 {
  private config: AWS.S3.ClientConfiguration
  private s3: AWS.S3

  constructor() {
    this.config = {
      apiVersion: '2006-03-01',
      accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
      region: process.env.AWS_S3_REGION,
      signatureVersion: 'v4'
    }

    this.s3 = new AWS.S3(this.config)
  }

  extractKeyFromPresignedUrl(presignedUrl: string): string | null {
    const parsedUrl = new URL(presignedUrl)

    const key = parsedUrl.pathname?.slice(1)

    return key || null
  }

  checkUrlExpired(signedUrl?: string): Promise<boolean> {
    if (signedUrl === '' || !signedUrl) return true
    return new Promise((resolve, reject) => {
      fetch(signedUrl)
        .then((response) => {
          if (response.status === 403) {
            resolve(true)
          } else {
            resolve(false)
          }
        })
        .catch((error) => {
          reject('Error:', error.message)
        })
    })
  }

  getSignUrlForFile(uniqKey?: string): Promise<{ signedUrl: string; fileName: string }> {
    if (uniqKey === '' || !uniqKey) return { signedUrl: '', fileName: '' }
    return new Promise((resolve, reject) => {
      try {
        const fileName = path.basename(uniqKey)

        const params: AWS.S3.GetObjectRequest = {
          Bucket: process.env.AWS_S3_BUCKET_NAME as string,
          Key: uniqKey,
          Expires: 30 * 60
        }

        const signedUrl = this.s3.getSignedUrl('getObject', params)

        if (signedUrl) {
          return resolve({
            signedUrl,
            fileName
          })
        } else {
          return reject('Cannot create signed URL')
        }
      } catch (err) {
        return reject('Cannot create signed URL!')
      }
    })
  }

  upload(
    filepath: string,
    name?: string,
    options?: { resize?: { width: number; height: number } }
  ): Promise<{ filepath: string; data: AWS.S3.PutObjectOutput[] }> {
    return new Promise((resolve, reject) => {
      if (fs.existsSync(filepath)) {
        const res: { filepath: string; data: AWS.S3.PutObjectOutput[] } = {
          filepath: filepath,
          data: []
        }
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
          if (
            options &&
            options.resize &&
            typeof options.resize.width === 'number' &&
            typeof options.resize.height === 'number'
          ) {
            const width = options.resize.width
            const height = options.resize.height

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

  async generateSignedUrlIncludeCheckExpire(presigned_url?: string): Promise<string> {
    if (!presigned_url || presigned_url.length === 0) return ''

    const isUrlExpired = await this.checkUrlExpired(presigned_url)
    const uniq_key = this.extractKeyFromPresignedUrl(presigned_url)

    const shouldUpdateUrl = isUrlExpired && uniq_key && uniq_key !== ''

    if (shouldUpdateUrl) {
      const { signedUrl } = await this.getSignUrlForFile(uniq_key)
      return signedUrl
    }

    return presigned_url
  }
}

export default new AWSS3()
