"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Document, {
        foreignKey: "user_id",
        as: "documents",
      });
      User.hasMany(models.ChatSession, {
        foreignKey: "user_id",
        as: "chatSessions",
      });
      User.hasMany(models.PointsHistory, {
        foreignKey: "user_id",
        as: "pointsHistory",
      });
      User.hasOne(models.UserSettings, {
        foreignKey: "user_id",
        as: "userSettings",
      });
      User.hasMany(models.Question, {
        foreignKey: "user_id",
        as: "questions",
      });
    }
  }
  User.init(
    {
      full_name: DataTypes.STRING,
      email: DataTypes.STRING,
      password_hash: DataTypes.STRING,
      role: DataTypes.STRING,
      points: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "User",
    },
  );
  return User;
};
