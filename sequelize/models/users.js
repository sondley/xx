"use strict";


module.exports = Users;


////////////////////////////////////////////////////////////


function Users(objSequelize, objDataTypes) {

  const Users = objSequelize.define(
    'Users',
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
      email: {
        type: objDataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: objDataTypes.STRING,
        allowNull: false
      },
    },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
    }
  );

  return Users;
};
