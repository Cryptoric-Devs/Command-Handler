const embedBuilder = require('../../../utilities/EmbedBuilder');

module.exports = {
    customId: 'help_menu',
    
    async execute(interaction, client) {
        const originalUser = interaction.message.interaction?.user?.id || interaction.message.author?.id;
        
        if (originalUser && interaction.user.id !== originalUser) {
            const embed = embedBuilder.error(
                `This menu is not for you! Only <@${originalUser}> can interact with this. Type \`/help\` to get your own menu.`,
                'Access Denied'
            );
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        
        const value = interaction.values[0];
        let embed;
        
        if (value === 'utility') {
            embed = embedBuilder.create({
                title: `🛠️ ${client.config.bot.name} - Utility Commands`,
                description: '**━━━━━━━━━━━━━━━━━━━━━━━━━━━━**\nAll available utility commands with examples:',
                fields: [
                    {
                        name: '📡 /ping',
                        value: '```Check bot latency and response time```\n> Shows websocket ping, roundtrip latency, and cluster info',
                        inline: false
                    },
                    {
                        name: '**━━━━━━━━━━━━━━━━━━━━━━━━━━━━**\n📚 /help',
                        value: '```Display this interactive help menu```\n> Navigate through categories and view all commands',
                        inline: false
                    },
                    {
                        name: '**━━━━━━━━━━━━━━━━━━━━━━━━━━━━**\n🔘 /button',
                        value: '```Test button component handlers```\n> Interactive demonstration of the component v2 system',
                        inline: false
                    },
                    {
                        name: '**━━━━━━━━━━━━━━━━━━━━━━━━━━━━**\n🔧 /shard',
                        value: '```View shard and cluster statistics```\n> Detailed information about all running shards',
                        inline: false
                    },
                    {
                        name: '**━━━━━━━━━━━━━━━━━━━━━━━━━━━━**\n💡 Tip',
                        value: `All commands work with:\n> Slash: \`/command\`\n> Prefix: \`${client.config.bot.prefix}command\`\n> Mention: \`@${client.user.username} command\``,
                        inline: false
                    }
                ],
                footer: { 
                    text: `${client.config.bot.name} • ${client.config.bot.version}`,
                    iconURL: client.user.displayAvatarURL()
                },
                color: 0x5865F2
            });
        } else if (value === 'about') {
            embed = embedBuilder.create({
                title: `ℹ️ About ${client.config.bot.name}`,
                description: `A professional Discord bot built with cutting-edge technology.\n\n**━━━━━━━━━━━━━━━━━━━━━━━━━━━━**`,
                fields: [
                    {
                        name: '📋 Bot Information',
                        value: `\`\`\`yml\nName: ${client.config.bot.name}\nOwner: ${client.config.bot.owner}\nVersion: ${client.config.bot.version}\nPrefix: ${client.config.bot.prefix}\`\`\``,
                        inline: false
                    },
                    {
                        name: '**━━━━━━━━━━━━━━━━━━━━━━━━━━━━**\n⚙️ Technical Stack',
                        value: '```diff\n+ Framework: Discord.js v14\n+ Sharding: Discord-Hybrid-Sharding\n+ Language: JavaScript (Node.js)\n+ Components: v2 Handler System\n```',
                        inline: false
                    },
                    {
                        name: '**━━━━━━━━━━━━━━━━━━━━━━━━━━━━**\n📊 Live Statistics',
                        value: `\`\`\`yml\nServers: ${client.guilds.cache.size}\nUsers: ${client.users.cache.size}\nChannels: ${client.channels.cache.size}\nActive Cluster: ${client.cluster?.id || 0}\nTotal Shards: ${client.cluster?.count || 1}\`\`\``,
                        inline: false
                    }
                ],
                thumbnail: client.user.displayAvatarURL({ size: 1024 }),
                footer: { 
                    text: `Made with ❤️ by ${client.config.bot.owner}`,
                    iconURL: client.user.displayAvatarURL()
                },
                color: 0x5865F2
            });
        } else if (value === 'owner') {
            const isOwner = client.permissionHandler.isOwner(interaction.user.id);
            
            embed = embedBuilder.create({
                title: `👑 ${client.config.bot.name} - Owner Commands`,
                description: isOwner 
                    ? '**━━━━━━━━━━━━━━━━━━━━━━━━━━━━**\nExclusive commands for bot owners:'
                    : '**━━━━━━━━━━━━━━━━━━━━━━━━━━━━**\n⚠️ You are not a bot owner!',
                fields: [
                    {
                        name: '💻 /eval',
                        value: isOwner 
                            ? '```Execute JavaScript code for debugging```\n> ⚠️ **DISABLED by default** for security\n> Set `ENABLE_EVAL=true` to enable (NOT recommended for production)'
                            : '```Execute JavaScript code for debugging```\n> 🔒 Owner-only command',
                        inline: false
                    },
                    {
                        name: '**━━━━━━━━━━━━━━━━━━━━━━━━━━━━**\n🛡️ Security',
                        value: isOwner
                            ? '> Eval is **disabled by default** to prevent remote code execution\n> Only enable in **controlled, trusted environments**\n> Never enable in **production deployments**'
                            : '> These commands are restricted to bot owners only\n> Configure owner IDs in `.env` file',
                        inline: false
                    }
                ],
                thumbnail: client.user.displayAvatarURL({ size: 1024 }),
                footer: { 
                    text: isOwner 
                        ? `⚠️ Use with extreme caution • ${client.config.bot.version}`
                        : `Contact ${client.config.bot.owner} for access`,
                    iconURL: client.user.displayAvatarURL()
                },
                color: isOwner ? 0xFEE75C : 0xED4245
            });
        } else if (value === 'features') {
            embed = embedBuilder.create({
                title: `⚡ ${client.config.bot.name} - Features`,
                description: 'Explore the powerful features that make this bot unique!\n\n**━━━━━━━━━━━━━━━━━━━━━━━━━━━━**',
                fields: [
                    {
                        name: '🎯 Command System',
                        value: '```diff\n+ Slash Commands (/command)\n+ Prefix Commands (!command)\n+ @Mention Commands (@bot command)\n+ Hybrid command support\n+ Auto command deployment\n```',
                        inline: false
                    },
                    {
                        name: '**━━━━━━━━━━━━━━━━━━━━━━━━━━━━**\n🎨 Component v2 Handler',
                        value: '```diff\n+ Interactive Buttons\n+ Select Menus / Dropdowns\n+ Modal Forms\n+ Custom ID pattern matching\n+ Organized file structure\n```',
                        inline: false
                    },
                    {
                        name: '**━━━━━━━━━━━━━━━━━━━━━━━━━━━━**\n⚙️ Advanced Features',
                        value: '```diff\n+ Discord Hybrid Sharding\n+ Automatic shard management\n+ Colorful ASCII logging\n+ Event handler system\n+ Modular architecture\n+ Easy to customize\n```',
                        inline: false
                    },
                    {
                        name: '**━━━━━━━━━━━━━━━━━━━━━━━━━━━━**\n🚀 Performance',
                        value: '> Ultra-fast response times\n> Efficient resource usage\n> Auto-scaling with sharding\n> Built for reliability',
                        inline: false
                    }
                ],
                thumbnail: client.user.displayAvatarURL({ size: 1024 }),
                footer: { 
                    text: `${client.config.bot.name} • Powered by Discord.js v14`,
                    iconURL: client.user.displayAvatarURL()
                },
                color: 0x5865F2
            });
        }

        await interaction.update({ embeds: [embed] });
    }
};
