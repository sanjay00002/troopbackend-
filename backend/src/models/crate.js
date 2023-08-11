import { Model } from 'sequelize';
import { generateUserId } from '../lib/userId';

export default (sequelize, DataTypes) => {
  class Crate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.CrateCategories.hasMany(Crate, {
        foreignKey: 'crateCategoryId',
        sourceKey: 'id',
      });

      Crate.belongsTo(models.CrateCategories, {
        foreignKey: 'crateCategoryId',
        keyType: DataTypes.INTEGER,
        constraints: true,
        targetKey: 'id',
        uniqueKey: 'cratecategories_crate_fk_constraint',
      });

      models.User.hasMany(Crate, {
        foreignKey: 'userId',
        sourceKey: 'id',
      });

      Crate.belongsTo(models.User, {
        foreignKey: 'userId',
        keyType: DataTypes.STRING,
        constraints: true,
        targetKey: 'id',
        uniqueKey: 'user_crate_fk_constraint',
      });
    }
  }
  Crate.init(
    {
      crateCategoryId: { type: DataTypes.INTEGER, allowNull: false },
      expiryTime: { type: DataTypes.DATE, allowNull: true },
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
      modelName: 'Crate',
    },
  );
  Crate.beforeValidate((crate, options) => {
    if (crate.isNewRecord) {
      const id = `Crate-${generateUserId(10)}`;

      crate.id = id;
    }
  });
  return Crate;
};
