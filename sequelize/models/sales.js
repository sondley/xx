"use strict";


module.exports = Sales;


////////////////////////////////////////////////////////////


function Sales(sequelize, DataTypes) {

  var Sales = sequelize.define(
    'Sales',
    {
      id: {
        primaryKey: true,
        allowNull: false,
        unique: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false
      }
    },
    {
      
      timestamps: true,
      underscored: true,
      paranoid: true,
      associate: function(objModels) {
        Sales.belongsTo(objModels.Providers, {
          foreignKey: 'provider_id',allowNull: false,
          as: 'Provider'
        });
        Sales.belongsTo(objModels.Articles, {
          foreignKey: 'article_id',allowNull: false,
          as: 'Article'
        });
      }
    }
  );

  return Sales;
};
