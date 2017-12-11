"use strict";


module.exports = Categories;


////////////////////////////////////////////////////////////


function Categories(sequelize, DataTypes) {

  var Categories = sequelize.define(
    'Categories',
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

  return Categories;
};
