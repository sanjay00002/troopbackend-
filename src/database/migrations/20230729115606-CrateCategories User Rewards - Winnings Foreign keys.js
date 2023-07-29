/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
   */
  await queryInterface.addConstraint('Winnings', {
    fields: ['crateCategoryId'],
    type: 'foreign key',
    name: 'cratecategories_winnings_fk_constraint',
    references: {
      table: 'CrateCategories',
      field: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  await queryInterface.addConstraint('Winnings', {
    fields: ['userId'],
    type: 'foreign key',
    name: 'user_winnings_fk_constraint',
    references: {
      table: 'Users',
      field: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  await queryInterface.addConstraint('Winnings', {
    fields: ['rewardId'],
    type: 'foreign key',
    name: 'rewards_winnings_fk_constraint',
    references: {
      table: 'Rewards',
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
    'Winnings',
    'cratecategories_winnings_fk_constraint',
  );

  await queryInterface.removeConstraint(
    'Winnings',
    'user_winnings_fk_constraint',
  );

  await queryInterface.removeConstraint(
    'Winnings',
    'rewards_winnings_fk_constraint',
  );
}
