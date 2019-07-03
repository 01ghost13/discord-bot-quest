'use strict';

module.exports = (sequelize, DataTypes) => {

    const Emoji = sequelize.define(
        'Emoji',
        {
            discord_id: DataTypes.STRING,
            name:       DataTypes.STRING,
            channel_id: DataTypes.STRING,
            count:      DataTypes.INTEGER,
        },
        {
            tableName: 'Emojies',
            modelName: 'Emoji',

            timestamps: true,
            createdAt:  'created_at',
            updatedAt:  'updated_at',
            deletedAt:  false,
        }
    );

    Emoji.associate = function (models) {
        // associations can be defined here
    };

    Emoji.prototype.increaseCountOn = function (num) {
        return sequelize.query(
            `UPDATE "${Emoji.tableName}" SET count = count + :num WHERE id = :id`,
            {
                replacements: {
                    id: this.id,
                    num: num,
                },
                /*raw: true,*/
                type: sequelize.QueryTypes.UPDATE
            }
        );
    };

    return Emoji;

};
