/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
   */
  await queryInterface.addConstraint('UserRoles', {
    fields: ['roleId'],
    type: 'foreign key',
    name: 'role_userrole_fk_constraint',
    references: {
      table: 'Roles',
      field: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  await queryInterface.addConstraint('UserRoles', {
    fields: ['userId'],
    type: 'foreign key',
    name: 'user_userrole_fk_constraint',
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
    'UserRoles',
    'role_userrole_fk_constraint',
  );

  await queryInterface.removeConstraint(
    'UserRoles',
    'user_userrole_fk_constraint',
  );
}
