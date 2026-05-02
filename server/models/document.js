"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Document extends Model {
        static associate(models) {
            Document.belongsTo(models.User, {
                foreignKey: "user_id",
                as: "user",
            });
        }
    }
    Document.init(
        {
            user_id: DataTypes.INTEGER,
            title: DataTypes.STRING,
            file_path: DataTypes.STRING,
            file_size_bytes: DataTypes.INTEGER,
            file_format: DataTypes.STRING,
            page_count: DataTypes.INTEGER,
            processing_status: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Document",
        },
    );
    return Document;
};
