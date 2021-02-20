const express = require('express')
const multer =  require('multer')
const path = require('path')
const AWS =  require('aws-sdk')
const multerS3 = require('multer-s3')
const awsConfig = require(__dirname+'/../config/awsconfig.js')
const router = express.Router()
const {Post} = require('../models/')


// GET /posts
router.get('/', async(req, res, next)=>{
    try{
        const posts =  await Post.findAll()
        res.json(posts)
    }catch(error){
        return next(error)
    }
})

// GET /posts/:id
router.get('/:id', async(req, res, next)=>{
    try{
        const post = await Post.findOne({where: {id:req.params.id }})
        res.json(post)
    }catch(error){
        return next(error)
    }
})

// POST /posts
AWS.config.update({
    region : 'ap-northeast-2',
    accessKeyId : process.env.S3_ACCESS_KEY_ID,
    secretAccessKey : process.env.S3_SECRET_ACCESS_KEY,
})

const upload = multer({
    storage: multerS3({
        s3: new AWS.S3(),
        bucket:'jerryfirstimagebucket',
        key(req, file, cb){
            cb(null, `image_folder/${new Date()}${path.basename(file.originalname)}`)
        }
    }),
    limits: {fileSize: 20 * 1024 * 1024},
})

router.post('/', upload.single('file'), async(req, res, next)=>{
    const {title, writer, content} = req.body

    console.log(title, writer, content)
    console.log(req.file) //image url

    try {
        const result = await Post.create({
            title,
            writer,
            content
        })
        // res.json({
        //     status: 201,
        //     message: `${result.dataValues.id} post is created`
        // })
        res.end()
    }catch(error){
        console.log('error = ', error)
        return next(error)
    }
})

// PUT /posts/:id
router.put('/:id', async(req, res, next)=> {
    const {title, writer, content} = req.body
    try{
        await Post.update({
            title,
            writer,
            content
        },{
            where: {id:req.params.id}
        })
        res.json({
            message: `${req.params.id} post is edited`
        })
    }catch(error){
        return next(error)
    }
})

// DELETE /posts/:id
router.delete('/:id', async(req, res, next)=>{
    try{
        await Post.destroy({where: {id: req.params.id}})
        res.json({
            message: `${req.params.id} post is deleted`
        })
    }catch(error){
        return next(error)
    }
})

module.exports =  router