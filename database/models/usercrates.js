import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class UserCrates extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.hasMany(UserCrates, {
        foreignKey: 'userId',
        sourceKey: 'id',
      });

      UserCrates.belongsTo(models.User, {
        foreignKey: 'userId',
        targetKey: 'id',
        constraints: true,
        keyType: DataTypes.STRING,
        uniqueKey: 'user_usercrates_fk_constraint',
      });

      models.CrateCategories.hasMany(UserCrates, {
        foreignKey: 'crateCategoryId',
        sourceKey: 'id',
      });

      UserCrates.belongsTo(models.CrateCategories, {
        foreignKey: 'crateCategoryId',
        targetKey: 'id',
        constraints: true,
        keyType: DataTypes.INTEGER,
        uniqueKey: 'cratecategories_usercrates_fk_constraint',
      });
    }
  }
  UserCrates.init(
    {
      crateCategoryId: { type: DataTypes.INTEGER, allowNull: false },
      expiryTime: { type: DataTypes.DATE, allowNull: false },
      opened: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      userId: { type: DataTypes.STRING, allowNull: false },
    },
    {
      name: {
        singular: 'crate',
        plural: 'crates',
      },
      sequelize,
      modelName: 'UserCrates',
    },
  );
  return UserCrates;
};
