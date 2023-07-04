/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
   */
  await queryInterface.addConstraint('Contests', {
    fields: ['categoryId'],
    type: 'foreign key',
    name: 'contestcategories_contest_fk_constraint',
    references: {
      table: 'ContestCategories',
      field: 'id',
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
  await queryInterface.addConstraint(
    'Contests',
    'contestcategories_contest_fk_constraint',
  );
}
