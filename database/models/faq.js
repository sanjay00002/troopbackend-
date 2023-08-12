import { Model } from "sequelize";
import { generateUserId } from "../../backend/src/lib/userId";

export default (sequelize, DataTypes) => {
  class Faq extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Faq.init(
    {
      question: { type: DataTypes.STRING, allowNull: false },
      answer: { type: DataTypes.STRING, allowNull: false },
    },
    {
      name: {
        plural: "faqs",
        singular: "faq",
      },
      sequelize,
      modelName: "Faq",
    }
  );
  Faq.beforeValidate(async (faq, options) => {
    if (faq.isNewRecord) {
      const id = `Faq-${await generateUserId()}`;
      faq.id = id;
    }
  });
  return Faq;
};
