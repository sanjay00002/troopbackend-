/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
   */
  await queryInterface.addConstraint('Coupons', {
    fields: ['couponsLentId'],
    type: 'foreign key',
    name: 'couponslent_coupons_fk_constraint',
    references: {
      field: 'id',
      table: 'CouponsLents',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
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
    'couponslent_coupons_fk_constraint',
  );
}
