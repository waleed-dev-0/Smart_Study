"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    static associate(models) {
      Question.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
    }
  }
  Question.init(
    {
      document_id: DataTypes.INTEGER,
      user_id: DataTypes.INTEGER,
      question_text: DataTypes.TEXT,
      question_type: DataTypes.STRING,
      options: DataTypes.JSON,
      correct_answer: DataTypes.TEXT,
      explanation: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Question",
    },
  );
  return Question;
};
