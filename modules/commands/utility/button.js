const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const embedBuilder = require('../../../utilities/EmbedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('button')
        .setDescription('Test button component v2 handler'),
    
    name: 'button',
    description: 'Test button components',
    aliases: ['btn', 'test'],
    
    async execute(interactionOrMessage, argsOrClient, clientOrUndefined) {
        const isSlash = interactionOrMessage.isChatInputCommand?.();
        
        const embed = embedBuilder.create({
            title: '🔘 Button Component Test',
            description: 'Click the buttons below to test the component v2 handler!',
            footer: { text: 'Npg Bot • Component v2 Handler' }
        });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('test_button_success')
                    .setLabel('Success')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('✅'),
                new ButtonBuilder()
                    .setCustomId('test_button_danger')
                    .setLabel('Danger')
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji('❌'),
                new ButtonBuilder()
                    .setCustomId('test_button_primary')
                    .setLabel('Primary')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('🔵'),
                new ButtonBuilder()
                    .setLabel('Link Button')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://discord.js.org')
                    .setEmoji('🔗')
            );

        if (isSlash) {
            await interactionOrMessage.reply({ embeds: [embed], components: [row] });
        } else {
            await interactionOrMessage.reply({ embeds: [embed], components: [row] });
        }
    }
};
