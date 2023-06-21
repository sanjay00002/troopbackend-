/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
   */
  await queryInterface.addConstraint('Participants', {
    fields: ['userId'],
    type: 'foreign key',
    name: 'user_participants_fk_constraint',
    references: {
      table: 'Users',
      field: 'id',
    },
  });
  await queryInterface.addConstraint('Participants', {
    fields: ['contestId'],
    type: 'foreign key',
    name: 'contest_participants_fk_constraint',
    references: {
      table: 'Contests',
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
  await queryInterface.removeConstraint(
    'Participants',
    'user_participants_fk_constraint',
  );
  await queryInterface.removeConstraint(
    'Participants',
    'contest_participants_fk_constraint',
  );
}
