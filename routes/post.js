const express = require('express')
const router = express.Router()
const {Post} = require('../models/')

// GET /posts
router.get('/', async(req, res, next)=>{
    try{
        const posts =  await Post.findAll()
        console.log(posts)
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
router.post('/', async(req, res, next)=>{
    const {title, writer, content} = req.body
    try {
        await new Post.create({
            title,
            writer,
            content
        })
        res.json({status: 201})
    }catch(error){
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
    }catch(error){
        return next(error)
    }
})

// DELETE /posts/:id
router.delete('/:id', async(req, res, next)=>{
    try{
        await Post.destroy({where: {id: req.params.id}})
    }catch(error){
        return next(error)
    }
})

module.exports =  router