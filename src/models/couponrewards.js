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
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(1024),
        allowNull: false,
      },
      discount: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      couponCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      plainLink: {
        type: DataTypes.STRING,
        allowNull: false,
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
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      endDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      affiliateLink: { type: DataTypes.STRING, allowNull: false },
      merchantLogo: { type: DataTypes.STRING, allowNull: false },
      merchantName: { type: DataTypes.STRING, allowNull: false },
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
