parsePlot = require("./parse_plot");

function isHamletOwner(channel, user) {
    let n = channel[1] + channel[2];
    if(n === "HF" && user === "653198653791535105") {
        return true;
    }

    if(n === "MS" && user === "712014894484029530") {
        return true;
    }

    if(n === "SB" && user === "660809172606124052") {
        return true;
    }

    if(n === "MT" && user === "878805079224889364") {
        return true;
    }

    if(n === "WV" && user === "632299889388158986") {
        return true;
    }

    if(n === "HF" && user === "749516528696819723") {
        return true;
    }

    if(n === "OC" && user === "806501286349766728") {
        return true;
    }

    if(n === "WC" && user === "648581213334011904") {
        return true;
    }
    
    if((n === null || n.startsWith("K")) && user === "856950391556276305") {
        return true;
    }
    return false;
}


module.exports.init = async  (c, plots, reaction, user, auth) => {
    if (reaction.message.guild == null) return
    reaction.user = user
    if (user.bot) return
    if (reaction.emoji.name === "✅") {
        let village = reaction.message.channel.parent.name.split("-").join(" ")
        if (!plots[village]) return
        if (plots[village].data[parsePlot(reaction.message.content.replaceAll("unclaim",""))] && (plots[village].governor.split(",").includes(reaction.user.id)) || isHamletOwner(reaction.message.content, reaction.user.id)) {
            if(reaction.message.content.startsWith("unclaim")) {
                owner = reaction.message.member;
                plot = parsePlot(reaction.message.content.split("unclaim ")[1])
                plots = require("./unclaim_plot").unclaim(plot, owner, reaction.message, plots, auth);
            } else {
                owner = reaction.message.member;
                plot = parsePlot(reaction.message.content)
                plots = require("./claim_plot").claim(plot, owner, reaction.message, plots, auth);
            }
        }
    }
}