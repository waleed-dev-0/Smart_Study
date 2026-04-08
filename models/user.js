'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
  User.hasMany(models.Document, {
    foreignKey: 'user_id',
    as: 'documents'
  });

  User.hasMany(models.ChatSession, {
    foreignKey: 'user_id',
    as: 'chatSessions'
  });

  User.hasMany(models.PointsHistory, {
    foreignKey: 'user_id',
    as: 'pointsHistory'
  });
}
    
  }
  User.init({
    full_name: DataTypes.STRING,
    email: DataTypes.STRING,
    password_hash: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
  
};