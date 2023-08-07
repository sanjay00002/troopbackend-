import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class Coupons extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.hasMany(Coupons, {
        foreignKey: 'userId',
        sourceKey: 'id',
      });
      Coupons.belongsTo(models.User, {
        foreignKey: 'userId',
        targetKey: 'id',
        constraints: true,
        keyType: DataTypes.STRING,
        uniqueKey: 'user_coupons_fk_constraint',
      });

      models.CouponRewards.hasMany(Coupons, {
        foreignKey: 'couponRewardsId',
        sourceKey: 'id',
      });
      Coupons.belongsTo(models.CouponRewards, {
        foreignKey: 'couponRewardsId',
        targetKey: 'id',
        constraints: true,
        keyType: DataTypes.STRING,
        uniqueKey: 'couponrewards_coupons_fk_constraint',
      });
    }
  }
  Coupons.init(
    {
      couponRewardsId: { type: DataTypes.STRING, allowNull: false },
      userId: { type: DataTypes.STRING, allowNull: false },
      expiryTime: { type: DataTypes.DATE, allowNull: false },
      redeemed: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      redeemedAt: { type: DataTypes.DATE, allowNull: true },
    },
    {
      name: {
        singular: 'coupon',
        plural: 'coupons',
      },
      sequelize,
      modelName: 'Coupons',
    },
  );
  return Coupons;
};
