const Discord = require("discord.js");
const sheets = require("./Modules/spreadsheet");
let c = new Discord.Client({
    fetchAllMembers: true,
    intents: [Discord.GatewayIntentBits.GuildMessageReactions, Discord.GatewayIntentBits.Guilds, Discord.GatewayIntentBits.GuildMessages, Discord.GatewayIntentBits.GuildMembers, Discord.GatewayIntentBits.MessageContent, Discord.GatewayIntentBits.DirectMessages, Discord.GatewayIntentBits.GuildVoiceStates], partials: [Discord.Partials.Message, Discord.Partials.Channel, Discord.Partials.fetchAllMembers]
})
const token = require("./config/config.json").token;

sheets.authorize().then(auth => {
    let plots = {};
    sheets.saveData(auth);
    c.on("ready", async () => {
        plots.ailsbury = await sheets.listPlots(auth, "Ailsbury");
        plots.hemstead = await sheets.listPlots(auth, "Hemstead");
        plots.cashvillage = await sheets.listPlots(auth, "Cashvillage");
        plots["new arbridge"] = await sheets.listPlots(auth, "New Arbridge");
        plots.hamlets = await sheets.listPlots(auth, "Hamlets");
        if(c.user !== null) {
            require("./Modules/client_ready").init(c, plots)
        }
    })
    c.on("messageCreate", async (m) => {
        if(c.user !== null) {
            require("./Modules/message_create").init(c, plots, m, auth)
        }
    })

    c.on("interactionCreate", async (m) => {
        if(c.user !== null) {
            require("./Modules/interaction_create").init(c, plots, m, auth)
        }
    })

    c.on("messageReactionAdd", async (m, u) => {
        if(c.user !== null) {
            require("./Modules/reaction_create").init(c, plots, m, u, auth)
        }
    })
})

c.login(token);