const Sequelize = require('sequelize')

module.exports = class Post extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            title: {
                type: Sequelize.STRING(30),
                allowNull: false,
            },
            writer: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            content : {
                type: Sequelize.TEXT,
                allowNull: false
            }
        }, {
            sequelize,
            timestamps: true,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        })
    }
    static associate(db){
        db.Post.hasMany(db.PostImage, {foreignKey: 'post', sourceKey: 'id', onDelete: 'CASCADE', hooks:true})
    }
}