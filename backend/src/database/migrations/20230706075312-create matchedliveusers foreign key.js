/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
   */
  await queryInterface.addConstraint('MatchedLiveUsers', {
    fields: ['selfId'],
    type: 'foreign key',
    name: 'matchedlive_selfuser_fk_constraint',
    references: {
      table: 'Users',
      field: 'id',
    },
  });

  await queryInterface.addConstraint('MatchedLiveUsers', {
    fields: ['opponentId'],
    type: 'foreign key',
    name: 'matchedlive_opponent_fk_constraint',
    references: {
      table: 'Users',
      field: 'id',
    },
  });

  await queryInterface.addConstraint('MatchedLiveUsers', {
    fields: ['selfSelectedStockId'],
    type: 'foreign key',
    name: 'matchedlive_selfStock_fk_constraint',
    references: {
      table: 'Stocks',
      field: 'id',
    },
  });

  await queryInterface.addConstraint('MatchedLiveUsers', {
    fields: ['selfSelectedStockId'],
    type: 'foreign key',
    name: 'matchedlive_opponentStock_fk_constraint',
    references: {
      table: 'Stocks',
      field: 'id',
    },
  });

  await queryInterface.addConstraint('MatchedLiveUsers', {
    fields: ['contestId'],
    type: 'foreign key',
    name: 'matchedlive_contest_fk_constraint',
    references: {
      table: 'LiveContests',
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
    'MatchedLiveUsers',
    'matchedlive_selfuser_fk_constraint',
  );
  await queryInterface.removeConstraint(
    'MatchedLiveUsers',
    'matchedlive_opponent_fk_constraint',
  );
  await queryInterface.removeConstraint(
    'MatchedLiveUsers',
    'matchedlive_selfStock_fk_constraint',
  );
  await queryInterface.removeConstraint(
    'MatchedLiveUsers',
    'matchedlive_opponentStock_fk_constraint',
  );
  await queryInterface.removeConstraint(
    'MatchedLiveUsers',
    'matchedlive_contest_fk_constraint',
  );
}
