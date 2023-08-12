/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('RewardsLents', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.STRING,
    },
    merchantId: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    title: {
      type: Sequelize.STRING(512),
      allowNull: true,
    },
    description: {
      type: Sequelize.STRING(1024),
      allowNull: true,
    },
    discount: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    plainLink: {
      type: Sequelize.STRING(512),
      allowNull: true,
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
      type: Sequelize.STRING(1024),
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
      type: Sequelize.STRING(512),
      allowNull: true,
    },
    merchantLogo: {
      type: Sequelize.STRING(512),
      allowNull: true,
    },
    merchantName: {
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
  await queryInterface.dropTable('RewardsLents');
}
