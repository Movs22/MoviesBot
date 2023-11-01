parsePlot = require("./parse_plot");
const fs = require("fs")
function isHamletOwner(channel, user) {
    let n = null;
    if(channel !== null) {
        n = channel[1] + channel[2];
    }
    if((n === "HF" || n === null) && user === "653198653791535105") {
        return true;
    }

    if((n === "MS"  ||n === null) && user === "712014894484029530") {
        return true;
    }

    if((n === "SB" || n === null) && user === "660809172606124052") {
        return true;
    }

    if((n === "MT" || n === null) && user === "878805079224889364") {
        return true;
    }
    if((n === "WV" || n === null) && user === "632299889388158986") {
        return true;
    }
    if((n === "HF" || n === null) && user === "749516528696819723") {
        return true;
    }
    if((n === "OC" || n === null) && user === "806501286349766728") {
        return true;
    }

    if((n === "WC" || n === null) && user === "648581213334011904") {
        return true;
    }
    if((n === null || n.startsWith("K")) && user === "856950391556276305") {
        return true;
    }
    return false;
}

module.exports.init = async (c, plots, message, auth) => {
    if (message.guild == null) return
    if (message.author.bot) return;
    if(message.channel.id === "1167871151922487398" || message.channel.id === "1167867661351407786") {
        require("./points").parsePoints(message, (message.channel.id === "1167871151922487398"))
        return;
    }
    if (message.author.id === "896732255534338078" && message.content.startsWith("-cooldown")) {
        return require("./cooldown").send(message.channel, require("./parse_plot")(message.content), message.content.split(" ")[1])
    }
    
    if (!message.channel.parent || !message.channel.parent.parent) return
    if (message.channel.parent.parent.id === "1001819329622450236") {
        let village = message.channel.parent.name.split("-").join(" ")
        if (!plots[village]) return
        if (message.content.startsWith("unclaim")) {
            require("./unclaim_plot").parse(message, plots, village);
            return;
        } else {
            if (plots[village].data[parsePlot(message.content)]) {
                require("./claim_plot").parse(message, plots, village);
                return;
            } else {
                if (message.author.id === "896732255534338078" && message.content === "-parse") {
                    if (!message.reference) return;
                    let m = await message.channel.messages.fetch(message.reference.messageId)
                    message.delete()
                    c.emit("messageCreate", m)
                    return;
                }
                if (message.author.id === "896732255534338078" && message.content.startsWith("-approve")) {
                    if (!message.reference) return;
                    let m = await message.channel.messages.fetch(message.reference.messageId)
                    plot = parsePlot(message.content.split(" ")[2])
                    message.guild.members.fetch(message.content.split(" ")[1]).then(owner => {
                        plots = require("./claim_plot").claim(plot, owner, m, plots, auth);
                    });
                    message.delete()
                }
                if (plots[village].governor.split(",").includes(message.author.id) || isHamletOwner(null, message.author.id)) {
                    if (!message.reference) return;
                    let m = await message.channel.messages.fetch(message.reference.messageId)
                    plot = parsePlot(m.content)
                    if (message.content.toLowerCase().startsWith("approved") || message.content.toLowerCase().startsWith("accepted")) {
                        await m.reactions.removeAll()
                        if (m.content.startsWith("unclaim")) {
                            owner = m.member;
                            plot = parsePlot(m.content.split("unclaim ")[1])
                            plots = require("./unclaim_plot").unclaim(plot, owner, m, plots, auth);
                        } else {
                            owner = m.member;
                            plots = require("./claim_plot").claim(plot, owner, m, plots, auth);
                        }
                    } else if (message.content.toLowerCase().startsWith("denied") && (isHamletOwner(message.content, message.author.id) || plots[village].governor.split(",").includes(message.author.id))) {
                        await m.reactions.removeAll();
                        reason = message.content.split(" ")
                        reason.shift()
                        reason = reason.join(" ")
                        m.react("❌").catch(e => {
                            m.reply("Denied")
                        })
                        if (message.content.toLowerCase().includes("blacklist")) {
                            m.react("🇧").catch(e => {
                            })
                        } else if (message.content.toLowerCase().includes("claim more then") || message.content.toLowerCase().includes("too many plots")) {
                            m.react("🇪").catch(e => {
                            })
                        } else {
                            m.react("🇴").catch(e => {
                            })
                        }
                        if (m.author == null) {
                            return;
                        }
                        m.author.createDM().then(c => {
                            if (m.content.startsWith("unclaim")) {
                                c.send(":x: Your request to unclaim plot `" + m.content.split("unclaim ")[1] + "` was **denied** for the following reason: `" + reason + "`.").catch(e => {
                                    m.channel.send("Failed to DM user <@" + m.member.id + ">.")
                                })
                            } else {
                                c.send(":x: Your request for plot `" + m.content + "` was **denied** for the following reason: `" + reason + "`.").catch(e => {
                                    m.channel.send("Failed to DM user <@" + m.member.id + ">.")
                                })
                            }
                            message.delete()
                        }).catch(e => {
                            m.channel.send("Failed to DM user <@" + m.member.id + ">.")
                        })
                    }
                }
            }
        }
    }
}