const express = require('express')
const router = express.Router()
const {upload} = require('./middlewares')
const {Post, PostImage, sequelize} = require('../models/')
const s3 = require('../config/s3')

// GET /posts
router.get('/', async(req, res, next)=>{
    try{
        const [posts, metadata] = await sequelize.query(`
            select posts.id, posts.title, posts.writer, posts.createdAt, posts.updatedAt, postimages.imageUrl 
            from posts 
            left join postimages on posts.id = postimages.post
        `)
        res.json(posts)
    }catch(error){
        return next(error)
    }
})

// GET /posts/:id
router.get('/:id', async(req, res, next)=>{
    try{
        const [post, metadata] = await sequelize.query(`
            select posts.id, posts.title, posts.writer, posts.createdAt, posts.updatedAt, postImages.imageUrl, posts.content 
            from posts 
            left join postimages on posts.id = postimages.post 
            where posts.id = ${req.params.id}
        `)
        res.json(post[0])
    }catch(error){
        return next(error)
    }
})

// POST /posts
router.post('/', upload.single('file'), async(req, res, next)=>{
    const {title, writer, content} = req.body
    try {
        const result = await Post.create({
            title,
            writer,
            content
        })

        if(req.file != null){
            await PostImage.create({
                imageKey: req.file.key,
                imageUrl: req.file.location,
                post: result.dataValues.id
            })
        }

        res.json({
            status: 201,
            message: `${result.dataValues.id} post is created`
        })
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
        const [post, metadata] = await sequelize.query(`
            select imageKey, imageUrl
            from postImages
            where post = ${req.params.id}
        `)

        const params =  {
            Bucket: 'jerryfirstimagebucket',
            Key: post[0].imageKey
        }
        s3.deleteObject(params, (err, data)=>{
            if (err) {
                return next(err)
            }
        })
        await Post.destroy({where: {id: req.params.id}})

        
        res.json({
            message: `${req.params.id} post is deleted`
        })
    }catch(error){
        return next(error)
    }
})

module.exports =  router