const { ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const embedBuilder = require('../../../utilities/EmbedBuilder');

module.exports = {
    customId: 'help_refresh',
    
    async execute(interaction, client) {
        const originalUser = interaction.message.interaction?.user?.id || interaction.message.author?.id;
        
        if (originalUser && interaction.user.id !== originalUser) {
            const embed = embedBuilder.error(
                `This help menu belongs to <@${originalUser}>. Use \`/help\` to get your own!`,
                'Not Your Menu'
            );
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        
        const embed = embedBuilder.create({
            title: `📚 ${client.config.bot.name} - Help Center`,
            description: `Welcome to **${client.config.bot.name}**! Your powerful Discord bot with full component support.\n\n**━━━━━━━━━━━━━━━━━━━━━━━━━━━━**`,
            fields: [
                {
                    name: '🛠️ Utility Commands',
                    value: '```\n/ping      - Check bot latency\n/help      - Show this menu\n/button    - Test button components\n/shard     - View shard information\n```',
                    inline: false
                },
                {
                    name: '**━━━━━━━━━━━━━━━━━━━━━━━━━━━━**\n📝 Multiple Ways to Use Commands',
                    value: `> **Slash Commands:** \`/ping\`\n> **Prefix Commands:** \`${client.config.bot.prefix}ping\`\n> **@Mention Commands:** \`@${client.user.username} ping\`\n> **Just Mention:** \`@${client.user.username}\` (for help)`,
                    inline: false
                },
                {
                    name: '**━━━━━━━━━━━━━━━━━━━━━━━━━━━━**\n⚡ Bot Features',
                    value: '```diff\n+ Discord.js v14\n+ Slash Commands\n+ Prefix Commands  \n+ @Mention Support\n+ Component v2 Handler\n+ Discord Hybrid Sharding\n+ Colorful Logging\n```',
                    inline: false
                },
                {
                    name: '**━━━━━━━━━━━━━━━━━━━━━━━━━━━━**\n📊 Statistics',
                    value: `\`\`\`yml\nServers: ${client.guilds.cache.size}\nUsers: ${client.users.cache.size}\nChannels: ${client.channels.cache.size}\nCluster: ${client.cluster?.id || 0}\nShards: ${client.cluster?.count || 1}\`\`\``,
                    inline: false
                }
            ],
            footer: { 
                text: `Made by ${client.config.bot.owner} • ${client.config.bot.version}`,
                iconURL: client.user.displayAvatarURL()
            },
            thumbnail: client.user.displayAvatarURL({ size: 1024 }),
            color: 0x5865F2
        });

        const selectRow = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('help_menu')
                    .setPlaceholder('📂 Select a category to explore')
                    .setMinValues(1)
                    .setMaxValues(1)
                    .addOptions([
                        {
                            label: 'Utility Commands',
                            description: 'View all utility commands',
                            value: 'utility',
                            emoji: '🛠️'
                        },
                        {
                            label: 'Bot Information',
                            description: 'Learn more about the bot',
                            value: 'about',
                            emoji: 'ℹ️'
                        },
                        {
                            label: 'Features',
                            description: 'View bot features and capabilities',
                            value: 'features',
                            emoji: '⚡'
                        }
                    ])
            );

        const buttonRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Invite Bot')
                    .setStyle(ButtonStyle.Link)
                    .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`)
                    .setEmoji('➕'),
                new ButtonBuilder()
                    .setLabel('Support Server')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://discord.gg/yourinvite')
                    .setEmoji('💬'),
                new ButtonBuilder()
                    .setCustomId('help_refresh')
                    .setLabel('Refresh')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('🔄')
            );

        await interaction.update({ embeds: [embed], components: [selectRow, buttonRow] });
    }
};
