'use strict';
const Sequelize = require('sequelize');
const Post = require('./post')
const PostImage = require('./postImage')

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config)
db.sequelize = sequelize

db.Post = Post
db.PostImage = PostImage 

Post.init(sequelize)
PostImage.init(sequelize)

Post.associate(db)
PostImage.associate(db)

module.exports = db;
