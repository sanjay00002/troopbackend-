'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    return Promise.all([
      queryInterface.addColumn('Profiles', 'phoneNumber', {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      }),
      queryInterface.removeColumn('Users', 'phoneNumber'),
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    return Promise.all([
      queryInterface.removeColumn('Profiles', 'phoneNumber'),
      queryInterface.addColumn('Users', 'phoneNumber', {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      }),
    ]);
  },
};
