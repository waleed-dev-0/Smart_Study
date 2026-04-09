"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PointsHistory extends Model {
    static associate(models) {
      PointsHistory.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
    }
  }
  PointsHistory.init(
    {
      user_id: DataTypes.INTEGER,
      type: DataTypes.STRING,
      reason: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "PointsHistory",
    },
  );
  return PointsHistory;
};
