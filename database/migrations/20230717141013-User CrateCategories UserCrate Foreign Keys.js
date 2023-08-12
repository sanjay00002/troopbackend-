/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
   */
  await queryInterface.addConstraint('UserCrates', {
    fields: ['userId'],
    type: 'foreign key',
    name: 'user_usercrates_fk_constraint',
    references: {
      field: 'id',
      table: 'Users',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  await queryInterface.addConstraint('UserCrates', {
    fields: ['crateCategoryId'],
    type: 'foreign key',
    name: 'cratecategories_usercrates_fk_constraint',
    references: {
      field: 'id',
      table: 'CrateCategories',
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
    'UserCrates',
    'user_usercrates_fk_constraint',
  );

  await queryInterface.removeConstraint(
    'UserCrates',
    'cratecategories_usercrates_fk_constraint',
  );
}
