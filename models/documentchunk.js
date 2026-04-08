'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DocumentChunk extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

      static associate(models) {
  DocumentChunk.belongsTo(models.Document, {
    foreignKey: 'document_id',
    as: 'document'
  });
}
    
  }
  DocumentChunk.init({
    document_id: DataTypes.INTEGER,
    chunk_index: DataTypes.INTEGER,
    chunk_content: DataTypes.TEXT,
    token_count: DataTypes.INTEGER,
    embedding: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'DocumentChunk',
  });
  return DocumentChunk;
};