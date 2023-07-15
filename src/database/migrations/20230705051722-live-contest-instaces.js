'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('LiveContestUserPool', { 
      id:{
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      contest_id:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      user_id:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      socket_id:{
        type:Sequelize.STRING,
        allowNull:false,
      },
      stock_id:{
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      matched: {
        type: Sequelize.BOOLEAN,
        allowNull:true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
     });

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
    */
    await queryInterface.dropTable('LiveContestUserPool');
  }
};
