/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
   */
  await queryInterface.addConstraint('Crates', {
    fields: ['crateCategoryId'],
    type: 'foreign key',
    name: 'cratecategories_crate_fk_constraint',
    references: {
      table: 'CrateCategories',
      field: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  await queryInterface.addConstraint('Crates', {
    fields: ['userId'],
    type: 'foreign key',
    name: 'user_crate_fk_constraint',
    references: {
      table: 'Users',
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
    'Crates',
    'cratecategories_crate_fk_constraint',
  );

  await queryInterface.removeConstraint('Crates', 'user_crate_fk_constraint');
}
