"use strict";


module.exports = Jobs;


////////////////////////////////////////////////////////////


function Jobs(sequelize, DataTypes) {

  var Jobs = sequelize.define(
    'Jobs',
    {
      id: {
        primaryKey: true,
        allowNull: false,
        unique: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false
      },
      price: {
        type: DataTypes.DOUBLE,
        allowNull: false
      }
    },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
    }
  );

  return Jobs;
};
