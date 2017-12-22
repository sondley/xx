"use strict";


module.exports = MediaTypes;


////////////////////////////////////////////////////////////


function MediaTypes(objSequelize, objDataTypes) {

  const MediaTypes = objSequelize.define(
    'MediaTypes',
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true,
        type: objDataTypes.INTEGER,
        // defaultValue: DataTypes.UUIDV4
      },
      name: {
        type: objDataTypes.STRING,
        allowNull: false
      }
    },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
      associate: function(objModels) {
        MediaTypes.hasMany(objModels.Media, {
          foreignKey: 'type_id',
          as: 'Medias'
        });
      }
    }
  );

  return MediaTypes;
};
