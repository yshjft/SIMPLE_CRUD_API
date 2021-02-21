const Sequelize = require('sequelize')

module.exports = class PostImage extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            imageKey: {
                type: Sequelize.STRING(300),
                allowNull: false
            },
            imageUrl: {
                type: Sequelize.STRING(300),
                allowNull: false
            }
        },{
            sequelize,
            timestamps: true,
            charSet:'utf8',
            collate: 'utf8_general_ci'
        })
    }
    static associate(db){
        db.PostImage.belongsTo(db.Post,{
            foreignKey: 'post',
            targetKey: 'id'
        })
    }
}