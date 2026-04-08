'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PointsHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
   static associate(models) {
  PointsHistory.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'user'
  });
}
  }
  PointsHistory.init({
    user_id: DataTypes.INTEGER,
    action_type: DataTypes.STRING,
    points_used: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PointsHistory',
  });
  return PointsHistory;
};