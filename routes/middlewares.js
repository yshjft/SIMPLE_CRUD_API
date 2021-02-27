const {Post, PostImage, sequelize} = require('../models/')
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
        async key(req, file, cb){
            if(req.params.id){
                const [postImage, metadata] = await sequelize.query(`
                    select imageKey 
                    from postImages
                    where post = ${req.params.id}
                `)

                if(postImage.length === 0) cb(null, `image_folder/${new Date()}${path.basename(file.originalname)}`)
                else cb(null, postImage[0].imageKey)    
            }else{
                cb(null, `image_folder/${new Date()}${path.basename(file.originalname)}`)
            }
        }
    }),
    limits: {fileSize: 20 * 1024 * 1024},
})
