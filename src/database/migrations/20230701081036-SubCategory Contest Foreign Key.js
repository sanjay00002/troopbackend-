/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
   */

  await queryInterface.addConstraint('Contests', {
    fields: ['subCategoryId'],
    type: 'foreign key',
    name: 'subcategories_contest_fk_constraint',
    references: {
      table: 'SubCategories',
      field: 'id',
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
    'Contests',
    'subcategories_contest_fk_constraint',
  );
}
