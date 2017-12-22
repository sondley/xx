"use strict";


module.exports = Media;


////////////////////////////////////////////////////////////


function Media(objSequelize, objDataTypes) {

  const Media = objSequelize.define(
    'Media',
    {
      id: {
        primaryKey: true,
        allowNull: false,
        unique: true,
        type: objDataTypes.UUID,
        defaultValue: objDataTypes.UUIDV4
      },
      filename: {
        type: objDataTypes.STRING,
        allowNull: false
      },
      mimetype: {
        type: objDataTypes.STRING,
        allowNull: false
      },
      path: {
        type: objDataTypes.STRING,
        allowNull: false
      },
      size: {
        type: objDataTypes.INTEGER,
        allowNull: true
      },
    },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
      associate: function(objModels) {
        Media.belongsTo(objModels.Users, { foreignKey: { name: 'user_id', allowNull: false }, as: 'User' });
        Media.belongsTo(objModels.MediaTypes, { foreignKey: { name: 'type_id', allowNull: false }, as: 'MediaType' });
      }
    }
  );

  return Media;
};
