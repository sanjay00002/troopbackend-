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
    await queryInterface.createTable('BankDetails',{
      id:{
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      },
      bankAccount:{
        type: Sequelize.STRING,
        allowNull: false
      },
      ifsc:{
        type: Sequelize.STRING,
        allowNull: false
      },
      address:{
        type: Sequelize.STRING,
        allowNull: false
      },
      userId:{
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('BankDetails')
  }
};
