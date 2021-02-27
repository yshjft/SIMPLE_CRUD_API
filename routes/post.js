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

// PUT /posts/:id`
/*
    수정할 때는 S3를 덮어 씌워야 한다.
    case 'file이 있는 경우' :
        case '기존 수정':
            S3에서 기존 이미지 삭제
            postsImages 업데이트
        case '새로운 업로드':
            postImages에 추가

    case 'file이 없는 경우':
        case '삭제':
            postImages만 삭제
            S3도 삭제
        case '변경 없음':
            아무것도 안함
*/
router.put('/:id', upload.single('file'), async(req, res, next)=> {
    const {title, writer, content, imageUrl} = req.body
    const {file} = req

    try{
        await Post.update({
            title,
            writer,
            content
        },{
            where: {id:req.params.id}
        })

        
        // await PostImage.create({
        //     imageKey: file.key,
        //     imageUrl: file.location,
        //     post: req.params.id
        // })


        // if(imageUrl && file){
        //     // 기존 S3 삭제
        //     await PostImage.update({
        //         imageKey: file.key,
        //         imageUrl: file.location
        //     },{
        //         where: {post: req.params.id}
        //     })
        // }

        // if(!imageUrl && file){
        //     await PostImage.create({
        //         imageKey: file.key,
        //         imageUrl: file.location,
        //         post: req.params.id
        //     })
        // }

        // if(imageUrl  && !file){
        //     // postImages 삭제
        //     // S3 삭제
        // }

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

        if(post.length !== 0){
            const params =  {
                Bucket: 'jerryfirstimagebucket',
                Key: post[0].imageKey
            }
            s3.deleteObject(params, (err, data)=>{
                if (err) {
                    return next(err)
                }
            })
        }
        await Post.destroy({where: {id: req.params.id}})

        
        res.json({
            message: `${req.params.id} post is deleted`
        })
    }catch(error){
        return next(error)
    }
})

module.exports =  router