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

            paranoid:   true,
            timestamps: true,

            createdAt:  'created_at',
            updatedAt:  'updated_at',
            deletedAt:  'deleted_at',
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

    Emoji.createOrUpdate = async function (channel_id, emoji_data) {
        let emoji = await Emoji.findOne({
            where: {
                discord_id: emoji_data.id,
                channel_id: channel_id
            }
        });

        if (emoji) {
            return emoji.increaseCountOn(emoji_data.count);
        }

        return Emoji.create({
            discord_id: emoji_data.id,
            name:       emoji_data.name,
            channel_id: channel_id,
            count:      1,
        });
    };

    Emoji.removeNonExistingEmoji = async function (channel_id, guild_emojis) {
        let emojies = await Emoji.findAll({
            where: { channel_id: channel_id }
        });

        emojies.forEach(emoji => {
            if (!guild_emojis.find(val => val.id === emoji.discord_id)) {
                emoji.destroy();
                console.log(`Emoji ${emoji.discord_id} from ${channel_id} deleted!`);
            }
        });
    };

    Emoji.getMessageParserRegex = () => new RegExp('<:(\\w{2,}):(\\d+)>', 'ig');

    Emoji.getFromMessage = function (content) {
        let
            regex = Emoji.getMessageParserRegex(),
            result,
            emojies = {};

        while (result = regex.exec(content)) {
            let
                emoji_discord_id   = result[2],
                emoji_discord_name = result[1];

            if (emoji_discord_id in emojies) {
                emojies[emoji_discord_id].count++;
            }
            else {
                emojies[emoji_discord_id] = {
                    id:    emoji_discord_id,
                    name:  emoji_discord_name,
                    count: 1,
                };
            }
        }

        return emojies;
    };

    return Emoji;

};
