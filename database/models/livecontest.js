import { Model } from "sequelize";
import { nanoid } from "nanoid/async";

// import("nanoid/async").then((nanoid) => nanoid.nanoid);

export default (sequelize, DataTypes) => {
  class LiveContest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Stocks.hasMany(LiveContest, {
        foreignKey: "stock1Id",
        sourceKey: "id",
      });

      LiveContest.belongsTo(models.Stocks, {
        foreignKey: "stock1Id",
        targetKey: "id",
        constraints: true,
        keyType: DataTypes.INTEGER,
        uniqueKey: "stock1_livecontest_fk_constraint",
      });
      
      models.Stocks.hasMany(LiveContest, {
        foreignKey: "stock2Id",
        sourceKey: "id",
      });

      LiveContest.belongsTo(models.Stocks, {
        foreignKey: "stock2Id",
        targetKey: "id",
        constraints: true,
        keyType: DataTypes.INTEGER,
        uniqueKey: "stock2_livecontest_fk_constraint",
      });

         
      models.Stocks.hasMany(LiveContest, {
        foreignKey: "stocktoken1",
        sourceKey: "token",
      });

      LiveContest.belongsTo(models.Stocks, {
        foreignKey: "stocktoken1",
        targetKey: "token",
        constraints: true,
        keyType: DataTypes.INTEGER,
        uniqueKey: "stock1token_livecontest_fk_constraint",
      });


      models.Stocks.hasMany(LiveContest, {
        foreignKey: "stocktoken2",
        sourceKey: "token",
      });

      LiveContest.belongsTo(models.Stocks, {
        foreignKey: "stocktoken2",
        targetKey: "token",
        constraints: true,
        keyType: DataTypes.INTEGER,
        uniqueKey: "stocktoken2_livecontest_fk_constraint",
      });
      models.User.hasMany(LiveContest, {
        foreignKey: "createdBy",
        sourceKey: "id",
      });

      LiveContest.belongsTo(models.User, {
        foreignKey: "createdBy",
        targetKey: "id",
        constraints: true,
        keyType: DataTypes.STRING,
        uniqueKey: "user_livecontest_fk_constraint",
      });
    }
  }
  LiveContest.init(
    {
      stock1Id: { type: DataTypes.INTEGER, allowNull: false },
      stock2Id: { type: DataTypes.INTEGER, allowNull: false },
      entryAmount: { type: DataTypes.DOUBLE, allowNull: false },
      isLive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      createdBy: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: "LiveContest",
    }
  );
  LiveContest.beforeValidate(async (contest, option) => {
    if (contest.isNewRecord) {
      const id = await nanoid(10);
      contest.id = id;
    }
  });
  return LiveContest;
};
