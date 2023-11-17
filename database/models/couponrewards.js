import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class CouponRewards extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CouponRewards.init(
    {
      merchantId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(1024),
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING(1024),
        allowNull: true,
      },
      discount: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      couponCode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      plainLink: {
        type: DataTypes.STRING(512),
        allowNull: true,
      },
      minPurchase: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      maxDiscount: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      terms: {
        type: DataTypes.STRING(1024),
        allowNull: true,
      },
      couponType: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      startDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      endDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      affiliateLink: { type: DataTypes.STRING(512), allowNull: true },
      merchantLogo: { type: DataTypes.STRING(512), allowNull: true },
      merchantName: { type: DataTypes.STRING, allowNull: true },
    },
    {
      name: {
        singular: 'couponReward',
        plural: 'couponRewards',
      },
      sequelize,
      modelName: 'CouponRewards',
    },
  );
  return CouponRewards;
};
