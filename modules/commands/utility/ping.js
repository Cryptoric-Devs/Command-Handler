const { SlashCommandBuilder, ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, MessageFlags } = require('discord.js');
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
        
        if (isSlash) {
            const sent = await interactionOrMessage.deferReply({ fetchReply: true });
            const roundtrip = sent.createdTimestamp - interactionOrMessage.createdTimestamp;
            
            const container = new ContainerBuilder();
            const header = new TextDisplayBuilder()
                .setContent('## 🏓 Pong!');
            container.addTextDisplayComponents(header);
            container.addSeparatorComponents(new SeparatorBuilder());
            
            const stats = new TextDisplayBuilder()
                .setContent(
                    `**Websocket Latency:** \`${client.ws.ping}ms\`\n` +
                    `**Roundtrip Latency:** \`${roundtrip}ms\`\n` +
                    `**Cluster ID:** \`${client.cluster?.id || 0}\`\n` +
                    `**Shard Count:** \`${client.cluster?.count || 1}\``
                );
            container.addTextDisplayComponents(stats);
            
            container.addSeparatorComponents(new SeparatorBuilder());
            const footer = new TextDisplayBuilder()
                .setContent(`> Npg Bot • Shard ${client.cluster?.id || 0}`);
            container.addTextDisplayComponents(footer);
            
            await interactionOrMessage.editReply({ 
                components: [container], 
                flags: MessageFlags.IsComponentsV2 
            });
        } else {
            const sent = await interactionOrMessage.channel.send('🏓 Pinging...');
            const roundtrip = sent.createdTimestamp - interactionOrMessage.createdTimestamp;
            
            const container = new ContainerBuilder();
            const header = new TextDisplayBuilder()
                .setContent('## 🏓 Pong!');
            container.addTextDisplayComponents(header);
            container.addSeparatorComponents(new SeparatorBuilder());
            
            const stats = new TextDisplayBuilder()
                .setContent(
                    `**Websocket Latency:** \`${client.ws.ping}ms\`\n` +
                    `**Roundtrip Latency:** \`${roundtrip}ms\`\n` +
                    `**Cluster ID:** \`${client.cluster?.id || 0}\`\n` +
                    `**Shard Count:** \`${client.cluster?.count || 1}\``
                );
            container.addTextDisplayComponents(stats);
            
            container.addSeparatorComponents(new SeparatorBuilder());
            const footer = new TextDisplayBuilder()
                .setContent(`> Npg Bot • Shard ${client.cluster?.id || 0}`);
            container.addTextDisplayComponents(footer);
            
            await sent.edit({ 
                content: '', 
                components: [container], 
                flags: MessageFlags.IsComponentsV2 
            });
        }
    }
};
