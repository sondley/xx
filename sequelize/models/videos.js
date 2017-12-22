"use strict";


module.exports = Videos;


////////////////////////////////////////////////////////////


function Videos(objSequelize, objDataTypes) {

  const Videos = objSequelize.define(
    'Videos',
    {
      id: {
        primaryKey: true,
        allowNull: false,
        unique: true,
        type: objDataTypes.UUID,
        defaultValue: objDataTypes.UUIDV4
      },
      title: {
        type: objDataTypes.STRING,
        allowNull: false
      },
      description: {
        type: objDataTypes.STRING,
        allowNull: true
      },
      thumbnail: {
        type: objDataTypes.STRING,
        allowNull: true
      },
    },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
      associate: function(objModels) {
        Videos.belongsTo(objModels.Users, { foreignKey: { name: 'user_id', allowNull: false }, as: 'User' });
        Videos.hasMany(
          objModels.Media,
          {
            // foreignKey: { name: 'id', allowNull: false },
            // constraints: false,
            // scope: { type_id: 1 },
            as: 'Medias'
          }
        );
      }
    }
  );

  return Videos;
};
