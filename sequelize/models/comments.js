"use strict";


module.exports = Comments;


////////////////////////////////////////////////////////////


function Comments(objSequelize, objDataTypes) {

  const Comments = objSequelize.define(
    'Comments',
    {
      id: {
        primaryKey: true,
        allowNull: false,
        unique: true,
        type: objDataTypes.UUID,
        defaultValue: objDataTypes.UUIDV4
      },
      value: {
        type: objDataTypes.STRING,
        allowNull: false
      }
    },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
      associate: function(objModels) {
        // Comments.belongsTo(objModels.Jobs, { foreignKey: { name: 'job_id', allowNull: false }, as: 'Job' });
        Comments.belongsTo(objModels.Videos, { foreignKey: { name: 'video_id', allowNull: false }, as: 'Video' });
      }
    }
  );

  return Comments;
};
