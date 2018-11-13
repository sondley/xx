"use strict";


module.exports = Providers;


////////////////////////////////////////////////////////////


function Providers(objSequelize, objDataTypes) {

  const Providers = objSequelize.define(
    'Providers',
    {
      id: {
        primaryKey: true,
        allowNull: false,
        unique: true,
        type: objDataTypes.UUID,
        defaultValue: objDataTypes.UUIDV4
      },
      firstName: {
        field: "first_name",
        type: objDataTypes.STRING,
        allowNull: true,
      },
      lastName: {
        field: "last_name",
        type: objDataTypes.STRING,
        allowNull: true,
      },
      direction: {
        type: objDataTypes.STRING,
        allowNull: false,
        unique: true
      },
    
      phone: {
        type: objDataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
      
    }
  );

  return Providers;
};
