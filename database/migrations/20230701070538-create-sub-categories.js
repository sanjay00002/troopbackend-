/** @type {import('sequelize-cli').Migration} */
/**     'Nifty 50',
        'Nifty IT',
        'Nifty Auto',
        'Nifty Bank',
        'Penny Stocks',
        'Giant Stocks',
        'Practice',
*/
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('SubCategories', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    image: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('SubCategories');
}
