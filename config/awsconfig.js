require('dotenv').config()

module.exports = {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.SE_ACCESS_KEY_ID,
    region: 'ap-northeast-2'
}