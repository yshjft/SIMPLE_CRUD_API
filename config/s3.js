const AWS =  require('aws-sdk')

const s3 =  new AWS.S3({
    region : 'ap-northeast-2',
    accessKeyId : process.env.S3_ACCESS_KEY_ID,
    secretAccessKey : process.env.S3_SECRET_ACCESS_KEY,
})

module.exports = s3