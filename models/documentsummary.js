'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DocumentSummary extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
  DocumentSummary.belongsTo(models.Document, {
    foreignKey: 'document_id',
    as: 'document'
  });
}
    
  }
  DocumentSummary.init({
    document_id: DataTypes.INTEGER,
    summary_content: DataTypes.TEXT,
    summary_type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'DocumentSummary',
  });
  return DocumentSummary;
};