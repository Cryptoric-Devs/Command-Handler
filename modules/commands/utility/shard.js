const { SlashCommandBuilder } = require('discord.js');
const embedBuilder = require('../../../utilities/EmbedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shard')
        .setDescription('View detailed shard information and statistics'),
    
    name: 'shard',
    description: 'View shard information',
    aliases: ['shards', 'shardinfo', 'cluster'],
    
    async execute(interactionOrMessage, argsOrClient, clientOrUndefined) {
        const isSlash = interactionOrMessage.isChatInputCommand?.();
        const client = isSlash ? argsOrClient : clientOrUndefined;
        
        try {
            const clusterInfo = client.cluster;
            const totalShards = clusterInfo?.count || 1;
            const currentShard = clusterInfo?.id || 0;
            
            let shardStats = '';
            
            if (client.cluster && client.cluster.evalOnManager) {
                const results = await client.cluster.broadcastEval(c => ({
                    clusterId: c.cluster.id,
                    shardId: c.cluster.id,
                    guilds: c.guilds.cache.size,
                    users: c.users.cache.size,
                    channels: c.channels.cache.size,
                    ping: c.ws.ping,
                    uptime: c.uptime,
                    memory: Math.round(process.memoryUsage().heapUsed / 1024 / 1024)
                })).catch(() => null);

                if (results) {
                    shardStats = results.map((shard, index) => {
                        const isCurrent = shard.clusterId === currentShard;
                        const status = shard.ping > 0 ? '🟢 Online' : '🔴 Offline';
                        const uptime = formatUptime(shard.uptime);
                        
                        return `${isCurrent ? '**➤' : '  '} Shard ${shard.shardId}${isCurrent ? ' (Current)**' : ''}\n` +
                               `   ${status} | Ping: \`${shard.ping}ms\`\n` +
                               `   Guilds: \`${shard.guilds}\` | Users: \`${shard.users}\`\n` +
                               `   Channels: \`${shard.channels}\` | Memory: \`${shard.memory}MB\`\n` +
                               `   Uptime: \`${uptime}\``;
                    }).join('\n\n');
                }
            } else {
                shardStats = `**➤ Shard ${currentShard} (Current)**\n` +
                           `   🟢 Online | Ping: \`${client.ws.ping}ms\`\n` +
                           `   Guilds: \`${client.guilds.cache.size}\` | Users: \`${client.users.cache.size}\`\n` +
                           `   Channels: \`${client.channels.cache.size}\`\n` +
                           `   Uptime: \`${formatUptime(client.uptime)}\``;
            }

            const totalGuilds = client.guilds.cache.size;
            const totalUsers = client.users.cache.size;
            const totalChannels = client.channels.cache.size;

            const embed = embedBuilder.create({
                title: '🔧 Shard Information',
                description: `**Total Shards:** \`${totalShards}\`\n**Current Shard:** \`${currentShard}\`\n\n${shardStats}`,
                fields: [
                    {
                        name: '📊 Overall Statistics',
                        value: `Guilds: \`${totalGuilds}\` | Users: \`${totalUsers}\` | Channels: \`${totalChannels}\``,
                        inline: false
                    },
                    {
                        name: '⚙️ Bot Information',
                        value: `Version: \`2.0.0\`\nNode: \`${process.version}\`\nDiscord.js: \`v14\``,
                        inline: false
                    }
                ],
                footer: { text: `Npg Bot • Cluster ${currentShard}/${totalShards - 1}` },
                thumbnail: client.user.displayAvatarURL()
            });

            if (isSlash) {
                await interactionOrMessage.reply({ embeds: [embed] });
            } else {
                await interactionOrMessage.reply({ embeds: [embed] });
            }
        } catch (error) {
            client.logger.error('Error in shard command:', error);
            const errorEmbed = embedBuilder.error('Failed to fetch shard information. Please try again.');
            
            if (isSlash) {
                await interactionOrMessage.reply({ embeds: [errorEmbed], ephemeral: true });
            } else {
                await interactionOrMessage.reply({ embeds: [errorEmbed] });
            }
        }
    }
};

function formatUptime(uptime) {
    const seconds = Math.floor((uptime / 1000) % 60);
    const minutes = Math.floor((uptime / (1000 * 60)) % 60);
    const hours = Math.floor((uptime / (1000 * 60 * 60)) % 24);
    const days = Math.floor(uptime / (1000 * 60 * 60 * 24));

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0) parts.push(`${seconds}s`);

    return parts.join(' ') || '0s';
}
