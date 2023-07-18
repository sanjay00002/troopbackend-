/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
   */
  await queryInterface.addConstraint('Coupons', {
    fields: ['userId'],
    type: 'foreign key',
    name: 'user_coupons_fk_constraint',
    references: {
      field: 'id',
      table: 'Users',
    },
  });
}
export async function down(queryInterface, Sequelize) {
  /**
   * Add reverting commands here.
   *
   * Example:
   * await queryInterface.dropTable('users');
   */
  await queryInterface.removeConstraint(
    'Coupons',
    'user_coupons_fk_constraint',
  );
}
