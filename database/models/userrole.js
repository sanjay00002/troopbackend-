import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class UserRole extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Role.hasMany(UserRole, {
        foreignKey: 'roleId',
        sourceKey: 'id',
      });
      UserRole.belongsTo(models.Role, {
        foreignKey: 'roleId',
        targetKey: 'id',
        constraints: true,
        keyType: DataTypes.INTEGER,
        uniqueKey: 'role_userrole_fk_constraint',
      });
      models.User.hasMany(UserRole, {
        foreignKey: 'userId',
        sourceKey: 'id',
      });
      UserRole.belongsTo(models.User, {
        foreignKey: 'userId',
        targetKey: 'id',
        constraints: true,
        keyType: DataTypes.STRING,
        uniqueKey: 'user_userrole_fk_constraint',
      });
    }
  }
  UserRole.init(
    {
      userId: DataTypes.STRING,
      roleId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'UserRole',
    },
  );
  return UserRole;
};
