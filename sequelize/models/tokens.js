"use strict";


module.exports = Tokens;


////////////////////////////////////////////////////////////


function Tokens(objSequelize, objDataTypes) {

  const Tokens = objSequelize.define(
    'Tokens',
    {
      id: {
        primaryKey: true,
        allowNull: false,
        unique: true,
        type: objDataTypes.UUID,
        defaultValue: objDataTypes.UUIDV4
      },
      token: {
        type: objDataTypes.STRING,
        allowNull: false
      }
    },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
      associate: function(objModels) {
        Tokens.belongsTo(objModels.Users, { foreignKey: { name: 'user_id', allowNull: false }, as: 'User' });
        Tokens.belongsTo(objModels.TokenTypes, { foreignKey: { name: 'type_id', allowNull: false }, as: 'TokenType' });
      }
    }
  );

  return Tokens;
};
