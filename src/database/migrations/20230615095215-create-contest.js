/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('Contests', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.STRING,
    },
    category: {
      type: Sequelize.ENUM([
        'Special',
        'Sectoral',
        'Practice',
        'Head2Head',
        'Custom',
      ]),
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    image: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    description: {
      type: Sequelize.STRING(512),
      allowNull: true,
    },
    pricePool: {
      type: Sequelize.DOUBLE,
      allowNull: false,
    },
    createdBy: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    likes: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    slots: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    startTime: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    endTime: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    participants: {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
      allowNull: true,
    },
    winners: {
      type: Sequelize.ARRAY(Sequelize.JSON),
      allowNull: true,
    },
    priceDistribution: {
      type: Sequelize.ARRAY(Sequelize.JSON),
      allowNull: false,
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
  await queryInterface.dropTable('Contests');
}
