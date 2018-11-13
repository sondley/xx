"use strict";


module.exports = Articles;


////////////////////////////////////////////////////////////


function Articles(sequelize, DataTypes) {

  var Articles = sequelize.define(
    'Articles',
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
      },
      values: {
        type: DataTypes.STRING,
        allowNull: false
      },
      image: {
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

  return Articles;
};
