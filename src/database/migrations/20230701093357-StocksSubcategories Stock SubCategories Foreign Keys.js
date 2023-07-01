/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
   */
  await queryInterface.addConstraint('StocksSubCategories', {
    fields: ['subCategoryId'],
    type: 'foreign key',
    name: 'subcategories_stockssubcategories_fk_constraint',
    references: {
      table: 'SubCategories',
      field: 'id',
    },
  });

  await queryInterface.addConstraint('StocksSubCategories', {
    fields: ['stockId'],
    type: 'foreign key',
    name: 'stock_subcategories_fk_constraint',
    references: {
      table: 'Stocks',
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
    'StocksSubCategories',
    'stock_subcategories_fk_constraint',
  );

  await queryInterface.removeConstraint(
    'StocksSubCategories',
    'subcategories_stockssubcategories_fk_constraint',
  );
}
