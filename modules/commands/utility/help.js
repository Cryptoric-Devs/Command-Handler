const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const embedBuilder = require('../../../utilities/EmbedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('View all available commands and information about the bot'),
    
    name: 'help',
    description: 'View all available commands',
    aliases: ['commands', 'h'],
    
    async execute(interactionOrMessage, argsOrClient, clientOrUndefined) {
        const isSlash = interactionOrMessage.isChatInputCommand?.();
        const client = isSlash ? argsOrClient : clientOrUndefined;
        const userId = isSlash ? interactionOrMessage.user.id : interactionOrMessage.author.id;
        const isOwner = client.permissionHandler.isOwner(userId);
        
        const fields = [
            {
                name: '🛠️ Utility Commands',
                value: '```\n/ping      - Check bot latency\n/help      - Show this menu\n/button    - Test button components\n/shard     - View shard information\n```',
                inline: false
            }
        ];
        
        // Only show owner commands section to actual owners
        if (isOwner) {
            fields.push({
                name: '**━━━━━━━━━━━━━━━━━━━━━━━━━━━━**\n👑 Owner Commands',
                value: '```\n/eval      - Execute code (DISABLED by default)\n```\n> *⚠️ Use with extreme caution*',
                inline: false
            });
        }
        
        const { ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, SectionBuilder, ThumbnailBuilder, MessageFlags } = require('discord.js');
        
        const container = new ContainerBuilder();
        
        // Title
        const title = new TextDisplayBuilder()
            .setContent(`## 📚 ${client.config.bot.name} - Help Center`);
        container.addTextDisplayComponents(title);
        
        container.addSeparatorComponents(new SeparatorBuilder());
        
        // Description with thumbnail
        const descSection = new SectionBuilder();
        const desc = new TextDisplayBuilder()
            .setContent(`Welcome to **${client.config.bot.name}**! Your powerful Discord bot with full Component v2 support.`);
        descSection.addTextDisplayComponents(desc);
        
        const thumbnail = new ThumbnailBuilder({ media: { url: client.user.displayAvatarURL({ size: 1024 }) } });
        descSection.setThumbnailAccessory(thumbnail);
        container.addSectionComponents(descSection);
        
        // Commands section
        let commandsList = '**🛠️ Utility Commands**\n' +
            '> `/ping` - Check bot latency\n' +
            '> `/help` - Show this menu\n' +
            '> `/button` - Test button components\n' +
            '> `/shard` - View shard information\n\n';
        
        if (isOwner) {
            commandsList += '**👑 Owner Commands**\n' +
                '> `/eval` - Execute code (DISABLED by default)\n' +
                '> ⚠️ Use with extreme caution\n\n';
        }
        
        commandsList += `**📝 Multiple Ways to Use Commands**\n` +
            `> **Slash:** \`/ping\` | **Prefix:** \`${client.config.bot.prefix}ping\`\n` +
            `> **@Mention:** \`@${client.user.username} ping\`\n\n` +
            `**⚡ Bot Features**\n` +
            `> Discord.js v14 • Component v2 Handler\n` +
            `> Slash Commands • Prefix Commands\n` +
            `> @Mention Support • Hybrid Sharding\n\n` +
            `**📊 Statistics**\n` +
            `> Servers: \`${client.guilds.cache.size}\` | Users: \`${client.users.cache.size}\`\n` +
            `> Channels: \`${client.channels.cache.size}\` | Shard: \`${client.cluster?.id || 0}/${client.cluster?.count || 1}\``;
        
        const commandsText = new TextDisplayBuilder().setContent(commandsList);
        container.addTextDisplayComponents(commandsText);
        
        container.addSeparatorComponents(new SeparatorBuilder());
        
        const footer = new TextDisplayBuilder()
            .setContent(`> Made by ${client.config.bot.owner} • Version ${client.config.bot.version}`);
        container.addTextDisplayComponents(footer);
        
        // Build dropdown options - only include owner category for owners
        const dropdownOptions = [
            {
                label: 'Utility Commands',
                description: 'View all utility commands',
                value: 'utility',
                emoji: '🛠️'
            }
        ];
        
        if (isOwner) {
            dropdownOptions.push({
                label: 'Owner Commands',
                description: 'Bot owner exclusive commands',
                value: 'owner',
                emoji: '👑'
            });
        }
        
        dropdownOptions.push(
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
        );
        
        const selectRow = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('help_menu')
                    .setPlaceholder('📂 Select a category to explore')
                    .setMinValues(1)
                    .setMaxValues(1)
                    .addOptions(dropdownOptions)
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

        // Add action rows to container
        container.addActionRowComponents(selectRow);
        container.addActionRowComponents(buttonRow);

        if (isSlash) {
            await interactionOrMessage.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
        } else {
            await interactionOrMessage.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
        }
    }
};
