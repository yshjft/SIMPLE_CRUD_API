const multer =  require('multer')
const path = require('path')
const multerS3 = require('multer-s3')
const AWS =  require('aws-sdk')

AWS.config.update({
    region : 'ap-northeast-2',
    accessKeyId : process.env.S3_ACCESS_KEY_ID,
    secretAccessKey : process.env.S3_SECRET_ACCESS_KEY,
})

exports.upload = multer({
    storage: multerS3({
        s3: new AWS.S3(),
        bucket:'jerryfirstimagebucket',
        key(req, file, cb){
            cb(null, `image_folder/${new Date()}${path.basename(file.originalname)}`)
        }
    }),
    limits: {fileSize: 20 * 1024 * 1024},
})
