'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    try{
      await queryInterface.changeColumn('posts', 'content', {
        type: Sequelize.TEXT,
        allowNull: false
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
      await queryInterface.changeColumn('posts', 'content', {
        type: Sequelize.STRING,
        allowNull: false
      }, {
        transaction
      })
    }catch(error){
      await transaction.rollback()
      throw error
    }
  }
};
