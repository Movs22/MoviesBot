const Discord = require("discord.js")
parsePlot = require("./parse_plot");
checkPlots = require("./check_plots");
module.exports.init = async (c, plots, interaction, auth) => {
    if (interaction.isButton()) {
        if (interaction.customId === "chill") {
            interaction.reply({ content: "This button does nothing lol", ephemeral: true })
        }
        if (interaction.customId === "plots") {
            interaction.reply({ embeds: [new Discord.EmbedBuilder().setDescription("Click [here](https://www.youtube.com/watch?v=xvFZjo5PgG0) to view who owns the most plots in cashcraft :D").setTimestamp().setColor("#ff6666")], ephemeral: true })
        }
        if(interaction.customId.startsWith("revoke-")) {
            require("./points").revoke(interaction)
        }
    }
    if (interaction.isCommand()) {
        if (interaction.commandName === "eval" && (interaction.user.id === "896732255534338078" || interaction.user.id === "746250102162718800")) {
            try {
                eval("(async () => { " + interaction.options.getString("code") + "})()")
            } catch (e) {
                interaction.reply({ content: e.toString, ephemeral: true })
            }
            return
        }
        if (interaction.commandName === "points") {
            let user = interaction.member;
            if (interaction.member.roles.cache.has("953720555515826236")) {
                if(interaction.options.getUser("user")) {
                    user = await interaction.guild.members.fetch(interaction.options.getUser("user").id)
                }
            }
            let self = (user === interaction.member);
            let u = require("./points").getPoints(user.user.id)
            let dc = 0;
            let embed = new Discord.EmbedBuilder()
            .setTitle((self ? "Your points" : (user.nickname || user.user.globalName) + "'s points"))
            .setColor("#e91e63")
            let mc = 0;
            u.mc.forEach(d => {
                mc = mc + d.amount;
                embed
                .addFields({
                    name: d.amount + " minecraft points (ID: " + d.id + ")",
                    value: "Reason: " + d.reason + " | Points given <t:" + d.timestamp + ":R>"
                })
            })
            u.dc.forEach(d => {
                dc = dc + d.amount;
                embed
                .addField({
                    name: d.amount + " discord points (ID: " + d.id + ")",
                    value:  "Reason: " + d.reason + " | Points given <t:" + d.timestamp + ":R>"
                })
            })
            embed
            .setDescription((self ? "You've got " : (user.nickname || user.user.globalName) + " has ") + " a total of `" + mc + "` minecraft points and `" + dc + "` discord points.")

            interaction.reply({embeds:[embed], ephemeral: true})
            return;
        }
        interaction.deferReply().then(async a => {
            if (interaction.commandName === "plots") {
                let code = interaction.options.getString("code")
                let village = interaction.options.getString("village")
                if (!village && !code) {
                    interaction.editReply("❌ You must enter a village and/or a valid plot code.")
                }
                let z;
                if (village === "global") {
                    z = Object.values(plots.ailsbury.data)
                    z = z.concat(Object.values(plots.cashvillage.data))
                    z = z.concat(Object.values(plots.hemstead.data))
                    z = z.concat(Object.values(plots["new arbridge"].data))
                } else {
                    z = Object.values(plots[village].data)
                }
                if (code) {
                    z = z.filter(a => a.plot.replace(/[0-9]/g, '') === code)
                }
                let y = z.filter(a => (a.owner === "" || a.owner === "[BANNED]"))
                ytxt = ""
                for (let i = 0; i < y.length; i++) {
                    ytxt = ytxt + y[i].plot
                    if ((i + 1) < y.length) {
                        ytxt = ytxt + ", "
                    }
                }
                let x = z.filter(a => (a.owner !== "" && a.owner !== "[BANNED]"))
                xtxt = ""
                let v = []
                v.push({ owner: "[BANNED]", count: 0 })
                z.forEach(p => {
                    if (p.owner !== "") {
                        if (!v.find(a => a.owner === p.owner)) {
                            v.push({ owner: p.owner, count: 1 })
                        } else {
                            u = v.find(a => a.owner === p.owner)
                            v.splice(v.indexOf(u), 1);
                            u.count++;
                            v.push(u);
                        }
                    }
                })

                v.sort((a, b) => b.count - a.count)
                t = z.filter(a => a.owner === "[BANNED]")
                for (let i = 0; i < x.length; i++) {
                    xtxt = xtxt + x[i].plot
                    if ((i + 1) < x.length) {
                        xtxt = xtxt + ", "
                    }
                }
                ttxt = ""
                for (let i = 0; i < t.length; i++) {
                    ttxt = ttxt + t[i].plot
                    if ((i + 1) < t.length) {
                        ttxt = ttxt + ", "
                    }
                }
                ytxt2 = ""
                xtxt2 = ""
                if (ytxt.length > 100) {
                    ytxt2 = "*(Result trimmed, please read console for the entire list)*"
                }
                if (xtxt.length > 100) {
                    xtxt2 = "*(Result trimmed, please read console for the entire list)*"
                }
                let embed = new Discord.EmbedBuilder()
                    .setTitle(village.toUpperCase() + " plots")
                    .setDescription("Total plots: " + (z.length) + "\nAverage plots per person: " + Math.round(x.length / v.length * 100) / 100 + " plots.\nFree plots per claimed plots: " + Math.round(y.length / x.length * 100) / 100 + " plots.")
                    .addFields({
                        name: "✅ Available plots (" + y.length + ")",
                        value: (ytxt.substring(0, 100) + ytxt2) || "*None*"
                    }, {
                        name: "❌ Claimed plots (" + x.length + ")",
                        value: (xtxt.substring(0, 100) + xtxt2) || "*None*"
                    }, {
                        name: "👥 Person with the most plots (" + v[0].count + "/" + Math.round(v[0].count / z.length * 100) + "%)",
                        value: v[0].owner || "*None*"
                    }, {
                        name: "⛔ Plots owned by banned people (" + v[v.indexOf(v.find(a => a.owner === "[BANNED]"))].count + "/" + Math.round(v[v.indexOf(v.find(a => a.owner === "[BANNED]"))].count / z.length * 100) + "%)",
                        value: ttxt || "*None*"
                    })
                    .setColor("#E91E63")
                    .setTimestamp()
                console.log("====== Plot info of " + village + " @ " + (code || "ALL") + " ======")
                console.log("  - Free plots: " + ytxt)
                console.log("  - Claimed plots: " + xtxt)
                console.log("  - Total plots: " + z.length)
                console.log("  - Average plots per player: " + Math.round(x.length / v.length * 100) / 100)
                console.log("  - Free plots per claimed plots: " + Math.round(y.length / x.length * 100) / 100)
                console.log("  - Plot owners: (TOTAL: " + v.length + ")")
                v.forEach(pown => {
                    console.log("    - " + pown.owner + " >> " + pown.count + " plots")
                })
                console.log("  - Test ran on " + (new Date(Date.now())).toString())
                console.log("====== Plot info of " + village + " @ " + (code || "ALL") + " ======")
                interaction.editReply({ embeds: [embed], ephemeral: true })
            } else if (interaction.commandName === "check-plot") {
                let user = interaction.member.nickname || interaction.user.username;
                if (interaction.member.roles.cache.has("953720555515826236")) {
                    user = interaction.options.getString("user") || interaction.member.nickname || interaction.user.username
                }
                a = Object.values(plots.ailsbury.data).filter(a => a.owner === user)
                atxt = ""
                for (let i = 0; i < a.length; i++) {
                    atxt = atxt + a[i].plot
                    if ((i + 1) < a.length) {
                        atxt = atxt + ", "
                    }
                }
                c = Object.values(plots.cashvillage.data).filter(a => a.owner === user)
                ctxt = ""
                for (let i = 0; i < c.length; i++) {
                    ctxt = ctxt + c[i].plot
                    if ((i + 1) < c.length) {
                        ctxt = ctxt + ", "
                    }
                }
                h = Object.values(plots.hemstead.data).filter(a => a.owner === user)
                htxt = ""
                for (let i = 0; i < h.length; i++) {
                    htxt = htxt + h[i].plot
                    if ((i + 1) < h.length) {
                        htxt = htxt + ", "
                    }
                }
                n = Object.values(plots["new arbridge"].data).filter(a => a.owner === user)
                ntxt = ""
                for (let i = 0; i < n.length; i++) {
                    ntxt = ntxt + n[i].plot
                    if ((i + 1) < n.length) {
                        ntxt = ntxt + ", "
                    }
                }
                t = Object.values(plots.hamlets.data).filter(a => a.owner === user)
                ttxt = ""
                for (let i = 0; i < t.length; i++) {
                    ttxt = ttxt + t[i].plot
                    if ((i + 1) < t.length) {
                        ttxt = ttxt + ", "
                    }
                }
                let embed = new Discord.EmbedBuilder()
                    .setTitle(user + "'s plots")
                    .setDescription("Total plots: " + (a.length + c.length + h.length + n.length + t.length))
                    .addFields({
                        name: "🏖️ Ailsbury (" + a.length + ")",
                        value: atxt || "*None*"
                    }, {
                        name: "🏠 Cashvillage (" + c.length + ")",
                        value: ctxt || "*None*"
                    }, {
                        name: "🌲 Hemstead (" + h.length + ")",
                        value: htxt || "*None*"
                    }, {
                        name: "🏭 New Arbridge (" + n.length + ")",
                        value: ntxt || "*None*"
                    }, {
                        name: "🏝️ Hamlets (" + t.length + ")",
                        value: ttxt || "*None*"
                    })
                    .setColor("#E91E63")
                    .setTimestamp()
                interaction.editReply({ embeds: [embed], ephemeral: true })
            } else if (interaction.commandName === "create-plot") {
                try {
                    let v = interaction.options.getString("village")
                    let p = interaction.options.getString("plot-code")
                    p = parsePlot(p)
                    let a = interaction.options.getInteger("amount")
                    let o = interaction.options.getInteger("offset")

                    if (!a) a = 1
                    if (!o) o = 0
                    v = v.toLowerCase()
                    let r = await require("./spreadsheet").createPlot(auth, p, null, v, a, o)
                    if (r.status === 200) {
                        plots[v] = r.plots
                        pr = (plots.ailsbury.rows - 7) + (plots.hemstead.rows - 7) + (plots.cashvillage.rows - 7) + (plots["new arbridge"].rows - 7)
                        interaction.editReply("Succesefully created **" + a + "** plots in **" + v + "**. (" + p + (o + 1) + " to " + p + (o + a) + ")")
                        c.user.setActivity(pr + " plots.", { type: Discord.ActivityType.Watching })
                        return;
                    } else {
                        interaction.editReply("Failed to create plots in **" + v + "**.  Received the following error: `" + r.status + "`.")
                        return;
                    }
                } catch (e) {
                    console.log(e)
                    interaction.editReply(":x: An unknown error has occured.")
                }
            } else if (interaction.commandName === "create-hplot") {
                try {
                    let v = interaction.options.getString("hamlet")
                    let p = interaction.options.getString("plot-type")
                    let a = interaction.options.getInteger("amount")
                    let o = interaction.options.getInteger("offset")
                    if (!a) a = 1
                    if (!o) o = 0
                    let z = {mt:"878805079224889364", sb: "1140270442184187966", nb: "856950391556276305",ms:"712014894484029530", hf:"896732255534338078", oc: "806501286349766728"}
                    if(!eval("z." + v.toLowerCase())) {
                        return interaction.editReply(":x: You can't create plots in this hamlet.")
                    }
                    if(!p.match(/[A-F]/g)) {
                        return interaction.editReply(":x: Invalid plot type. It can only be A, B, C, D, E or F")
                    }
                    let code = "O" + v + p
                    v = v.toLowerCase()
                    let r = await require("./spreadsheet").createPlot(auth, code, null, "Hamlets", a, o)
                    if (r.status === 200) {
                        plots.hamlets = r.plots
                        pr = (plots.ailsbury.rows - 7) + (plots.hemstead.rows - 7) + (plots.cashvillage.rows - 7) + (plots["new arbridge"].rows - 7) + (plots["hamlets"].rows - 7)
                        interaction.editReply("Succesefully created **" + a + "** plots in your Hamlet (" + code + (o + 1) + " to " + code + (o + a) + ")")
                        c.user.setActivity(pr + " plots.", { type: Discord.ActivityType.Watching })
                        return;
                    } else {
                        interaction.editReply("Failed to create plots in **" + v + "**.  Received the following error: `" + r.status + "`.")
                        return;
                    }
                } catch (e) {
                    console.log(e)
                    interaction.editReply(":x: An unknown error has occured.")
                }
            } else if (interaction.commandName === "who-has-the-most-plots") {
                interaction.editReply("Reading database...")
                setTimeout(() => {
                    let row = new Discord.ActionRowBuilder()
                    let chill = new Discord.ButtonBuilder()
                        .setCustomId('plots')
                        .setLabel('Who owns the most plots?')
                        .setStyle(Discord.ButtonStyle.Primary);
                    row.addComponents(chill);
                    interaction.editReply({ content: "Click below to see who has the most plots in cashcraft!", components: [row] })
                }, 2000)
            } else if (interaction.commandName === "reload") {
                interaction.editReply("Reloading...")
                plots.ailsbury = await require("./spreadsheet").listPlots(auth, "Ailsbury")
                plots.hemstead = await require("./spreadsheet").listPlots(auth, "Hemstead")
                plots.cashvillage = await require("./spreadsheet").listPlots(auth, "Cashvillage")
                plots["new arbridge"] = await require("./spreadsheet").listPlots(auth, "New Arbridge")
                pr = (plots.ailsbury.rows - 7) + (plots.hemstead.rows - 7) + (plots.cashvillage.rows - 7) + (plots["new arbridge"].rows - 7)
                c.user.setActivity(pr + " plots.", { type: Discord.ActivityType.Watching })
                cc = 0
                mc = 0
                channels = ["1023634411817795644", "1023646602713370674", "1023646688465924096", "1023646725090582548"]
                interaction.editReply("Reload complete. (Loaded " + pr + " plots).")
                channels.forEach(async channel => {
                    let cha = (await c.guilds.cache.get("903230722603614279").channels.fetch(channel))
                    channels2 = cha.guild.channels.cache.filter(c => c.parent === cha)
                    channels2.forEach(channel2 => {
                        channel2.messages.fetch({ limit: 100 }).then(m => {
                            mc += m.size
                            cc += 1
                        })
                    })
                })
                setTimeout(() => {
                    interaction.followUp("Cached " + mc + " messages in " + cc + " channels.")
                    checkPlots(interaction.guild, plots)
                    interaction.followUp("Sending reminders...")
                }, 1000)
            } else {
                interaction.editReply(":x: Unknown command.")
            }
        }).catch(e => {
            console.log(e)
            interaction.editReply(":x: An unknown error has occured.")
        })
    }
}