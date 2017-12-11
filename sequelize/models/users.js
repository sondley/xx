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
        type: objDataTypes.STRING,
        allowNull: true,
      },
      lastName: {
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
      isAccountVerify: {
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
        Users.belongsTo(objModels.UserRoles, { foreignKey: { name: 'role_id', allowNull: false, defaultValue: ENUMS.USER_ROLES.USER }, as: 'Role' });
        Users.hasMany(objModels.Tokens, {
          foreignKey: 'user_id',
          as: 'Tokens'
        });
      }
    }
  );

  return Users;
};
