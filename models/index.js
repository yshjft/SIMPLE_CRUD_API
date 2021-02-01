'use strict';
const Sequelize = require('sequelize');
const Post = require('./post')

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config)
db.sequelize = sequelize

db.Post = Post

Post.init(sequelize)

module.exports = db;
