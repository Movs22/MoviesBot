const Discord = require("discord.js");

module.exports.init = async (c, plots) => {
    if (c.user !== null) {
        const token = require("../config/config.json").token;
        const rest = new Discord.REST({ version: '10' }).setToken(token);
        c.user.setActivity("index.js V2.", { type: Discord.ActivityType.Playing })
        let commands = require("./slash_commands").loadCommands(["createplot", "points", "createhplot", "reload", "evalcmd", "checkplot", "plots", "troll"]);
        try {
            await rest.put(
                Discord.Routes.applicationGuildCommands(c.user.id, "903230722603614279"), {
                body: commands
            });
            console.log('Successfully registered application commands for guild');
        } catch (error) {
            if (error) console.error(error);
        }
        pr = (plots.ailsbury.rows - 7) + (plots.hemstead.rows - 7) + (plots.cashvillage.rows - 7) + (plots["new arbridge"].rows - 7) + (plots.hamlets.rows - 7)
        console.log("Loaded " + pr + " plots.")
        c.user.setActivity(pr + " plots.", { type: Discord.ActivityType.Watching })
        channels = ["1143891345761640588", "1023634411817795644", "1023646602713370674", "1023646688465924096", "1023646725090582548"]
        channels.forEach(async channel => {
            let cha = (await c.guilds.cache.get("903230722603614279").channels.fetch(channel))
            channels2 = cha.guild.channels.cache.filter(c => c.parent === cha)
            channels2.forEach(channel2 => {
                channel2.messages.fetch({ limit: 100 }).then(m => {
                    m.forEach(msg => {
                        if (msg.author.id === "1075469164413735014" && channel2.name !== "Full list of available plots") {
                            msg.delete()
                        }
                    })
                })
            })
        })
        let g = (await c.guilds.fetch("903230722603614279"))
        require("./check_plots.js")(g, plots);
        setInterval(async () => {
            require("./check_plots.js")(g, plots);
        }, 60 * 1000)

    }
}