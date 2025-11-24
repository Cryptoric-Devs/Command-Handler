const { SlashCommandBuilder } = require('discord.js');
const embedBuilder = require('../../../utilities/EmbedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check the bot latency and response time'),
    
    name: 'ping',
    description: 'Check the bot latency',
    aliases: ['pong', 'latency'],
    
    async execute(interactionOrMessage, argsOrClient, clientOrUndefined) {
        const isSlash = interactionOrMessage.isChatInputCommand?.();
        const client = isSlash ? argsOrClient : clientOrUndefined;
        
        const embed = embedBuilder.create({
            title: '🏓 Pong!',
            fields: [
                {
                    name: 'Websocket Latency',
                    value: `\`${client.ws.ping}ms\``,
                    inline: true
                },
                {
                    name: 'Cluster ID',
                    value: `\`${client.cluster?.id || 0}\``,
                    inline: true
                },
                {
                    name: 'Shard Count',
                    value: `\`${client.cluster?.count || 1}\``,
                    inline: true
                }
            ],
            footer: { text: `Npg Bot • Shard ${client.cluster?.id || 0}` }
        });

        if (isSlash) {
            const sent = await interactionOrMessage.reply({ embeds: [embed], fetchReply: true });
            const roundtrip = sent.createdTimestamp - interactionOrMessage.createdTimestamp;
            
            embed.addFields({
                name: 'Roundtrip Latency',
                value: `\`${roundtrip}ms\``,
                inline: true
            });
            
            await interactionOrMessage.editReply({ embeds: [embed] });
        } else {
            const sent = await interactionOrMessage.reply({ embeds: [embed] });
            const roundtrip = sent.createdTimestamp - interactionOrMessage.createdTimestamp;
            
            embed.addFields({
                name: 'Roundtrip Latency',
                value: `\`${roundtrip}ms\``,
                inline: true
            });
            
            await sent.edit({ embeds: [embed] });
        }
    }
};
