/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
   */
  await queryInterface.addConstraint('Wallets', {
    fields: ['userId'],
    type: 'foreign key',
    references: {
      table: 'Users',
      field: 'id',
    },
    name: 'user_wallet_fk_constraint',
  });
}
export async function down(queryInterface, Sequelize) {
  /**
   * Add reverting commands here.
   *
   * Example:
   * await queryInterface.dropTable('users');
   */
  await queryInterface.removeConstraint('Wallets', 'user_wallet_fk_constraint');
}
