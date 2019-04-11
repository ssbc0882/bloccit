'use strict';
module.exports = (sequelize, DataTypes) => {
  var Rules = sequelize.define('Rules', {
    source: DataTypes.STRING,
    description: DataTypes.STRING
  }, {});
  Rules.associate = function (models) {
    // associations can be defined here
    Rules.belongsTo(models.Topic, {
      foreignKey: "topicId",
      onDelete: "CASCADE",
    })
  };
  return Rules;
};