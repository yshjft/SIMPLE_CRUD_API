'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    try{
      await queryInterface.createTable('Images', {
        imageUrl : {
          type: Sequelize.STRING(300),
          allowNull: false
        },
        postId:{
          type: Sequelize.INTEGER,
          references: {
            model: {
              tableName: 'posts',
            },
            key: 'id'
          },
          allowNull:false,
          onDelete: 'CASCADE',
        }
      },{
        transaction
      })
    }catch(error){
      await transaction.rollback()
      throw error
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    try{
      await queryInterface.dropTable('Images', {transaction})
    }catch(error){
      await transaction.rollback()
      throw error
    }
  }
};
