"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ChatSession extends Model {
    static associate(models) {
      ChatSession.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });

      ChatSession.belongsTo(models.Document, {
        foreignKey: "document_id",
        as: "document",
      });

      ChatSession.hasMany(models.ChatMessage, {
        foreignKey: "session_id",
        as: "messages",
      });
    }
  }
  ChatSession.init(
    {
      user_id: DataTypes.INTEGER,
      document_id: DataTypes.INTEGER,
      title: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "ChatSession",
    },
  );
  return ChatSession;
};
