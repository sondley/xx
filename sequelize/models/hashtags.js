"use strict";


module.exports = Hashtags;


////////////////////////////////////////////////////////////


function Hashtags(sequelize, DataTypes) {

  var Hashtags = sequelize.define(
    'Hashtags',
    {
      id: {
        primaryKey: true,
        allowNull: false,
        unique: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
    }
  );

  return Hashtags;
};
