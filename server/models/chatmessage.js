"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ChatMessage extends Model {
    static associate(models) {
      ChatMessage.belongsTo(models.ChatSession, {
        foreignKey: "session_id",
        as: "session",
      });
    }
  }
  ChatMessage.init(
    {
      session_id: DataTypes.INTEGER,
      sender_type: DataTypes.STRING,
      message_content: DataTypes.TEXT,
      tokens_used: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "ChatMessage",
    },
  );
  return ChatMessage;
};
