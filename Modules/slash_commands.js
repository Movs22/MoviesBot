const Discord = require("discord.js");
const { SlashCommandBuilder } = require("discord.js")

module.exports.loadCommands = (a) => {
    let createplot = new SlashCommandBuilder()
        .setName("create-plot")
        .setDescription("Creates a plot in a specified village.")
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ManageMessages)
        .addStringOption(o =>
            o.setName("village")
                .setDescription('The village where this plots should be created.')
                .setRequired(true)
                .addChoices(
                    { name: 'Ailsbury', value: 'Ailsbury' },
                    { name: 'Cashvillage', value: 'Cashvillage' },
                    { name: 'Hemstead', value: 'Hemstead' },
                    { name: 'New Arbridge', value: 'New Arbridge' },
                    { name: 'Hamlets', value: 'Hamlets' },
                )
        )
        .addStringOption(o => o.setName("plot-code").setDescription("Plot code to use.").setRequired(true))
        .addIntegerOption(o => o.setName("amount").setDescription("Amount of plots to create.").setMinValue(1).setMaxValue(50).setRequired(false))
        .addIntegerOption(o => o.setName("offset").setDescription("ID of the first plot").setMinValue(1).setMaxValue(100).setRequired(false))

        let points = new SlashCommandBuilder()
        .setName("points")
        .setDescription("Checks the points of a specified user.")
        .addUserOption(o =>
            o.setName("user")
                .setDescription('A specific user (OP only).')
                .setRequired(false)
        )

        let createhplot = new SlashCommandBuilder()
        .setName("create-hplot")
        .setDescription("Creates a plot in a specified hamlet.")
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ManageMessages)
        .addStringOption(o =>
            o.setName("hamlet")
                .setDescription('The hamlet where this plots should be created.')
                .setRequired(true)
                .addChoices(
                    { name: 'Harlowfield', value: 'HF' },
                    { name: 'Maidstoke', value: 'MS' },
                    { name: 'New Bicky', value: 'NB' },
                    { name: 'New Oak Common', value: 'OC' },
                    { name: 'Stalybridge', value: 'SB' },
                    { name: 'Milton', value: 'MT' },
                )
        )
        .addStringOption(o => o.setName("plot-type").setDescription("Plot type to use.").setRequired(true))
        .addIntegerOption(o => o.setName("amount").setDescription("Amount of plots to create.").setMinValue(1).setMaxValue(50).setRequired(false))
        .addIntegerOption(o => o.setName("offset").setDescription("ID of the first plot").setMinValue(1).setMaxValue(1000).setRequired(false))

    let checkplot = new SlashCommandBuilder()
        .setName("check-plot")
        .setDescription("Checks plots of a specific user")
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ManageMessages)
        .addStringOption(o => o.setName("user").setDescription("Minecraft username (OP only)").setRequired(false))

    let evalcmd = new SlashCommandBuilder()
        .setName("eval")
        .setDescription(":)")
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ManageMessages)
        .addStringOption(o =>
            o.setName("code")
                .setDescription('Code to run')
                .setRequired(true)
        )

    let troll = new SlashCommandBuilder()
        .setName("who-has-the-most-plots")
        .setDescription(":O")
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ManageMessages)

    let plots = new SlashCommandBuilder()
        .setName("plots")
        .setDescription(":)")
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ManageMessages)
        .addStringOption(o =>
            o.setName("village")
                .setDescription('The village where this plots should be checked.')
                .setRequired(true)
                .addChoices(
                    { name: 'Ailsbury', value: 'ailsbury' },
                    { name: 'Cashvillage', value: 'cashvillage' },
                    { name: 'Hemstead', value: 'hemstead' },
                    { name: 'New Arbridge', value: 'new arbridge' },
                    { name: 'GLOBAL', value: 'global' },
                )
        )
        .addStringOption(o =>
            o.setName("code")
                .setDescription('Specific plot code to filter.')
                .setRequired(false)
        )

    let reload = new SlashCommandBuilder()
        .setName("reload")
        .setDescription("Reloads the bot.")
    
    let commands = []
    a.forEach(b => {
        eval("commands.push(" + b + ")")
    })
    return commands;
}