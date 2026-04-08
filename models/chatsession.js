'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChatSession extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
   
    static associate(models) {
  ChatSession.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'user'
  });

  ChatSession.belongsTo(models.Document, {
    foreignKey: 'document_id',
    as: 'document'
  });

  ChatSession.hasMany(models.ChatMessage, {
    foreignKey: 'session_id',
    as: 'messages'
  });
}}
  ChatSession.init({
    user_id: DataTypes.INTEGER,
    document_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ChatSession',
  });
  return ChatSession;
};