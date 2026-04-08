'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChatMessage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    
     static associate(models) {
  ChatMessage.belongsTo(models.ChatSession, {
    foreignKey: 'session_id',
    as: 'session'
  });
}
  }
  ChatMessage.init({
    session_id: DataTypes.INTEGER,
    sender_type: DataTypes.STRING,
    message_content: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'ChatMessage',
  });
  return ChatMessage;
};