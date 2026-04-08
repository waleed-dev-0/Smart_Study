'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
  Question.belongsTo(models.Document, {
    foreignKey: 'document_id',
    as: 'document'
  });
}
    
  }
  Question.init({
    document_id: DataTypes.INTEGER,
    question_text: DataTypes.TEXT,
    answer: DataTypes.TEXT,
    question_type: DataTypes.STRING,
    difficulty_level: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Question',
  });
  return Question;
};