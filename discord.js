const api = require("./index").api;
const { Client, MessageEmbed, Message } = require("discord.js");
const client = new Client();
const config = require("./config");
client.login(config.token);
client.on('ready', () => {
    console.log("Logged in as "+client.user.tag);
    function gameTask() {
        client.user.setActivity(`${client.guilds.size} guilds. | ${config.prefix}help`, {type:"WATCHING"});
    }
    client.setInterval(gameTask, 300000);
    gameTask();
});

client.on('message', async msg => {
    if (msg.author.bot || !msg.content.startsWith(config.prefix)) return;
    const cmd = msg.content.toLowerCase().split(" ")[0].slice(config.prefix.length);
    const args = msg.content.split(" ").slice(1); 
    switch (cmd) {
        case "help":
        msg.channel.send(
            new MessageEmbed().setAuthor(client.user.username, client.user.displayAvatarURL()).setDescription(
`*\`Showing all commands:\`*
• Ping: Pong! :ping_pong:
• Server: Show some info about a Minehut server. ${config.prefix}server <server name>`
            )
        );
        break;
        case "ping":
        let m = await msg.channel.send("Pong! :ping_pong:");
        m.edit(`Pong! :ping_pong: (Roundtrip: ${m.createdTimestamp - msg.createdTimestamp}ms | One-way: ${~~client.ping}ms)`);
        break;
        case "server":
        if (args.length < 1) {
            return msg.channel.send(`:x: Invalid usage! \`${config.prefix}server <server name>\``)
        }
        let server = await api.getServerByName(args[0]);
        let commServer = api.getServerSessionByName(args[0]);
        msg.channel.send(new MessageEmbed()
    .setAuthor(client.user.username, client.user.displayAvatarURL())
    .setFooter("Minehut Stats Bot")
    .setTimestamp(new Date())
    .setDescription(
`Showing info about Server ***\`${server.name}\`***!
• Online? ${commServer?`:white_check_mark: (Player count: ${commServer.playerCount})`:":x:"}
• Created At: \`${new Date(server.creation).toDateString()}\`
• Credits Per Day: \`${server.credits_per_day}\`
• Message of the Day: \`${server.motd}\`
• Visible? ${server.visibility?":white_check_mark:":":x:"}
• Active Plugins? ${server.active_plugins.map(plgID => api.plugins.get(plgID).name).join(", ")}
• Purchased Plugins? ${server.purchased_plugins.map(plgID => api.plugins.get(plgID).name).join(", ")}
    • Server Settings:
        Allow Flight? ${server.server_properties.allow_flight?":white_check_mark:":":x:"}
        Allow Nether? ${server.server_properties.allow_nether?":white_check_mark:":":x:"}
        Difficulty? \`${server.server_properties.difficulty}\`
        Command Blocks? ${server.server_properties.enable_command_block?":white_check_mark:":":x:"}
        Force Gamemode? ${server.server_properties.force_gamemode?":white_check_mark:":":x:"}
        Default Gamemode? \`${server.server_properties.gamemode}\`
        Generate Structures? ${server.server_properties.generate_structures?":white_check_mark:":":x:"}
        Hardcore? ${server.server_properties.hardcore?":white_check_mark:":":x:"}
        Seed? \`${server.server_properties.level_seed==''?"None":server.server_properties.level_seed}\`
        Max players? \`${server.server_properties.max_players}\`
        Can PvP? ${server.server_properties.pvp?":white_check_mark:":":x:"}
        Summon Animals? ${server.server_properties.spawn_animals?":white_check_mark:":":x:"}
        Summon Mobs? ${server.server_properties.spawn_mobs?":white_check_mark:":":x:"}`)
    );
        break;
    }
});
