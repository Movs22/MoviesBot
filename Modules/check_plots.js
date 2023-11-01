const DB = require("./database")
const reminders = new DB("./reminders.json", { formatting: "compact" })
const { EmbedBuilder } = require("discord.js")
module.exports = async (g, plots) => {
    channels = ["1023634411817795644", "1023646602713370674", "1023646688465924096", "1023646725090582548"]
    channels.forEach(channel => {
        g.channels.fetch(channel).then(cha => {
            channels2 = cha.guild.channels.cache.filter(c => c.parent === cha && c.name === "Full list of available plots")
            channel2 = channels2.first()
            let b = false;
            channel2.messages.fetch({ limit: 100 }).then(m => {
                m.forEach(msg => {
                    if (msg.author !== undefined && msg.author.id === "1075469164413735014") {
                        b = true;
                        village = msg.channel.parent.name.replaceAll("-", " ")
                        p = Object.values(plots[village].data).filter(a => a.owner === "")
                        pts = ""
                        warn = ""
                        for(let i = 0; i < p.length; i++) {
                            if((pts.length + p[i].plot.length) < 2048) {
                                pts = pts + "**" + p[i].plot + "**" + ((i < (p.length -1) && (pts.length + p[i].plot.length) < 2048)? ", " : "");
                            } else {
                                pts = pts + "..."
                                break;
                            }
                        }
                        if(p.length < 20) {
                            warn = "\n \n > :warning: **" + village.toUpperCase() + "** is running out of plots. Consider looking for plots in other villages such as <#1023646725090582548> or <#1023634411817795644>."
                        } else if(p.length < Object.values(plots[village].data).length*.1) {
                            warn = "\n \n > :warning: Consider looking for plots in other villages that have a considerable amount of free plots such as <#1023646725090582548> or <#1023634411817795644>."
                        }
                        let embed = new EmbedBuilder()
                            .setTitle("Free plots in " + village.toUpperCase() + " (" + p.length + "/" + Object.values(plots[village].data).length + ")")
                            .setDescription(pts + warn)
                            .setFooter({ text: "Last updated" })
                            .setColor("#e91e63")
                            .setTimestamp()
                        msg.edit({ content: "⬇", embeds: [embed] })

                    }
                })
                if (b === false) {
                    console.log("Loaded embed in " + m.first().channel.parent.name + "/" + cha.name)
                    m.first().channel.send("Loading...")
                }
            })
        })
    })
    

    /* HAMLET plot list */
    let hamlets = [
        {
            c: "HF",
            n: "Harlowfield",
            a: 0,
            p: [],
            p2: [],
            e: "🏰"
        },
        {
            c: "OC",
            n: "New Oak Common",
            a: 0,
            p: [],
            p2: [],
            e: "🌲"
        },
        {
            c: "WC",
            n: "Welsemere",
            a: 0,
            p: [],
            p2: [],
            e: "🏖️"
        },
        {
            c: "HT",
            n: "Honton Town",
            a: 0,
            p: [],
            p2: []
        },
        {
            c: "WV",
            n: "Warham Valley",
            a: 0,
            p: [],
            p2: [],
            e: "🏔️"
        },
        {
            c: "MT",
            n: "Milton",
            a: 0,
            p: [],
            p2: []
        },
        {
            c: "BK",
            n: "New Bicky",
            a: 0,
            p: [],
            p2: [],
            e: "🍪"
        },
        {
            c: "SB",
            n: "Stalybridge",
            a: 0,
            p: [],
            p2: []
        },
        {
            c: "MS",
            n: "Maidstoke",
            a: 0,
            p: [],
            p2: [],
            e: "🏕️"
        },
        {
            c: "WD",
            n: "{Hamlets:Hamlet1}",
            a: 0,
            p: [],
            p2: []
        }
    ]
    g.channels.fetch("1143891345761640588").then(cha => {
        channels2 = cha.guild.channels.cache.filter(c => c.parent === cha && c.name === "Full list of available plots")
        channel2 = channels2.first()
        let b = false;
        channel2.messages.fetch({ limit: 100 }).then(m => {
            m.forEach(msg => {
                if (msg.author !== undefined && msg.author.id === "1075469164413735014") {
                    b = true;
                    village = msg.channel.parent.name.replaceAll("-", " ")
                    p = Object.values(plots[village].data);
                    p2 = Object.values(plots[village].data).filter(a => a.owner === "");
                    p.forEach(plot => {
                        z = hamlets.find(a => (plot.plot[0] + plot.plot[1] + plot.plot[2]).includes(a.c));
                        hamlets.splice(hamlets.indexOf(z), 1)
                        z.p.push(plot)
                        z.a += 1;
                        hamlets.push(z)
                    })
                    let embed = new EmbedBuilder()
                    .setTitle("Free plots in ALL Hamlets: " + p2.length + "/" + Object.values(plots[village].data).length)
                    .setFooter({ text: "Last updated" })
                    .setColor("#e91e63")
                    .setTimestamp()

                    hamlets.sort((a,b) => b.a - a.a)

                    hamlets.forEach(hamlet => {
                        hamlet.p2 = hamlet.p.filter(a => a.owner === "")
                        pts = ""
                        warn = ""
                        for(let i = 0; i < hamlet.p2.length; i++) {
                            if((pts.length + hamlet.p2[i].plot.length) < 2048) {
                                pts = pts + "**" + hamlet.p2[i].plot + "**" + ((i < (hamlet.p2.length -1) && (pts.length + hamlet.p2[i].plot.length) < 2048)? ", " : "");
                            } else {
                                pts = pts + "..."
                                break;
                            }
                        }
                        if(hamlet.p2.length < 10) {
                            warn = "\n \n > :warning: **" + hamlet.n.toUpperCase() + "** is running out of plots. Consider looking for plots in other hamlets."
                        } else if(hamlet.p2.length < Object.values(hamlet.p).length*.1) {
                            warn = "\n \n > :warning: Consider looking for plots in other villages that have a considerable amount of free plots such as <#1023646725090582548> or <#1023634411817795644>."
                        }
                        embed.addFields({
                            name: (hamlet.e ? hamlet.e : "❓") + " " + hamlet.n + " | " + hamlet.p2.length + "/" + hamlet.p.length + " plots",
                            value: "> " + (pts !== "" ? pts + warn : "❌ No plots were found.")
                        })
                        console.log
                    })
                    /*pts = ""
                    warn = ""
                    for(let i = 0; i < p.length; i++) {
                        if((pts.length + p[i].plot.length) < 2048) {
                            pts = pts + "**" + p[i].plot + "**" + ((i < (p.length -1) && (pts.length + p[i].plot.length) < 2048)? ", " : "");
                        } else {
                            pts = pts + "..."
                            break;
                        }
                    }
                    if(p.length < 20) {
                        warn = "\n \n > :warning: **" + village.toUpperCase() + "** is running out of plots. Consider looking for plots in other villages such as <#1023646725090582548> or <#1023634411817795644>."
                    } else if(p.length < Object.values(plots[village].data).length*.1) {
                        warn = "\n \n > :warning: Consider looking for plots in other villages that have a considerable amount of free plots such as <#1023646725090582548> or <#1023634411817795644>."
                    }*/
                    
                    msg.edit({ content: "⬇", embeds: [embed] })

                }
            })
            if (b === false) {
                console.log("Loaded embed in " + m.first().channel.parent.name + "/" + cha.name)
                m.first().channel.send("Loading...")
            }
        })
    })

    let c = g.channels.cache.get("1030128958089478155")
    let z = Date.now()
    Object.values(plots).forEach(village => {
        Object.values(village.data).forEach(plot => {
            if (plot.owner !== "") {
                let m = plot.ownerId
                if (m !== "[UNKNOWN]") {
                    if(!plot.plot) {
                        return;
                    }
                    if ((!reminders.read(plot.plot) && plot.r48 < (z / 1000) && plot.status == "FALSE")) {
                        c.send("<@" + m + "> your plot **" + plot.plot + "** is going to expire in **2 days**, better go and build it if you haven't already!")
                        console.log("@" + plot.owner + " your plot **" + plot.plot + "** is going to expire in **2 days**, better go and build it if you haven't already!")
                        reminders.write(plot.plot, "48h")
                    }
                    if ((reminders.read(plot.plot) == "48h" && plot.r24 < (z / 1000) && plot.status == "FALSE")) {
                        c.send("<@" + m + "> your plot **" + plot.plot + "** is going to expire in **1 day**, better go and build it if you haven't already!")
                        reminders.write(plot.plot, "24h")
                        console.log("@" + plot.owner + " your plot **" + plot.plot + "** is going to expire in **1 day**, better go and build it if you haven't already!")
                    }
                }
            }
        })
    })
}