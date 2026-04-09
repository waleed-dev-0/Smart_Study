"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserSettings extends Model {
    static associate(models) {
      UserSettings.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
    }
  }
  UserSettings.init(
    {
      user_id: DataTypes.INTEGER,
      theme: {
        type: DataTypes.STRING,
        defaultValue: "light",
      },
      language: {
        type: DataTypes.STRING,
        defaultValue: "en",
      },
    },
    {
      sequelize,
      modelName: "UserSettings",
    },
  );
  return UserSettings;
};
