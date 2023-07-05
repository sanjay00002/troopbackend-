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
    await queryInterface.createTable('LiveContests',{
      id:{
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      stock1Id:{
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      stock2Id:{
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      entryAmount: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      createdBy:{
        type: Sequelize.STRING,
        allowNull: false,
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
    await queryInterface.dropTable('LiveContests')
  }
};
