/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('Rewards', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.STRING,
    },
    merchantId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING(1024),
      allowNull: false,
    },
    discount: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    plainLink: {
      type: Sequelize.STRING(512),
      allowNull: false,
    },
    minPurchase: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    maxDiscount: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    terms: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    startDate: {
      type: Sequelize.DATEONLY,
      allowNull: true,
    },
    endDate: {
      type: Sequelize.DATEONLY,
      allowNull: true,
    },
    affiliateLink: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    merchantLogo: {
      type: Sequelize.STRING(512),
      allowNull: false,
    },
    merchantName: {
      type: Sequelize.STRING,
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
  await queryInterface.dropTable('Rewards');
}
