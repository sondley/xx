"use strict";


module.exports = TokenTypes;


////////////////////////////////////////////////////////////


function TokenTypes(objSequelize, objDataTypes) {

  const TokenTypes = objSequelize.define(
    'TokenTypes',
    {
      id: {
        primaryKey: true,
        allowNull: false,
        unique: true,
        type: objDataTypes.UUID,
        defaultValue: objDataTypes.UUIDV4
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
        TokenTypes.hasMany(objModels.Tokens, {
          foreignKey: 'type_id',
          as: 'Tokens'
        });
      }
    }
  );

  return TokenTypes;
};
