'use strict';

module.exports = (sequelize, DataTypes) => {

    const Message = sequelize.define(
        'Message',
        {
            discord_id: DataTypes.STRING,
            author:     DataTypes.STRING,
            content:    DataTypes.TEXT,
            channel_id: DataTypes.STRING,
        },
        {
            timestamps: true,
            createdAt:  'created_at',
            updatedAt:  false,
            deletedAt:  false,
        }
    );

    Message.associate = function (models) {
        // associations can be defined here
    };

    return Message;

};
