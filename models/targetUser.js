'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TargetUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TargetUser.init({
    userId: DataTypes.STRING,
    guildId: DataTypes.STRING,
    channelId: DataTypes.STRING,
    enabled: DataTypes.BOOLEAN,
    service: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'TargetUser',
  });
  return TargetUser;
};
