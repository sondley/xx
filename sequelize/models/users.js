"use strict";


const ENUMS = require('../../app/enums');

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
      username: {
        type: objDataTypes.STRING,
        allowNull: false,
        unique: true
      },
      email: {
        type: objDataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
        set(val) {
          this.setDataValue('email', val.toLowerCase());
        }
      },
      description: {
        type: objDataTypes.TEXT,
        allowNull: true,
      },
      password: {
        type: objDataTypes.STRING,
        allowNull: false
      },
      isAccountVerify: {
        field: "is_account_verify",
        type: objDataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
    },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
      associate: function(objModels) {
        Users.belongsTo(objModels.Roles, { foreignKey: { name: 'role_id', allowNull: false, defaultValue: ENUMS.USER_ROLES.USER }, as: 'Role' });
        Users.hasMany(objModels.Tokens, {
          foreignKey: 'user_id',
          as: 'Tokens'
        });
      }
    }
  );

  return Users;
};
