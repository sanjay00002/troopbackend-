'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('MatchedLiveUsers',{
      id:{
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },
      selfId:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      apponentId:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      selfSelectedStockId:{
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      apponnetSelectedStockId:{
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      contestId:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      winner: {
        type: Sequelize.ENUM([
          'Self',
          'Apponent'
        ])
      }
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('MatchedLiveUsers');
  }
};
