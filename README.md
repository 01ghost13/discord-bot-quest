# discord-bot-quest
# Create migration
Example:

`npx sequelize-cli model:generate --name TargetUser --attributes userId:string,guildId:string,channelId:string,enabled:boolean,service:string`

Add user to targets
For Jeka

```
insert into "TargetUsers" ("userId", "guildId", "channelId", enabled, service, "createdAt", "updatedAt") values 
                          ('172822815303663618', '177172000391954432', '177172000391954432', true, 'game_bully', now()::date, now()::date);
```