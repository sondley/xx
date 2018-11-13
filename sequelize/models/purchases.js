"use strict";


module.exports = Purchases;


////////////////////////////////////////////////////////////


function Purchases(sequelize, DataTypes) {

  var Purchases = sequelize.define(
    'Purchases',
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
      },
    },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
      associate: function(objModels) {
        Purchases.belongsTo(objModels.Customers, {
          foreignKey: 'customer_id',allowNull: false,
          as: 'Customer'
        });
        Purchases.belongsTo(objModels.Articles, {
          foreignKey: 'article_id',allowNull: false,
          as: 'Article'
        });
      }
    }
  );

  return Purchases;
};
