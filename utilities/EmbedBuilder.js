const { 
    ContainerBuilder, 
    TextDisplayBuilder, 
    SeparatorBuilder,
    MessageFlags,
    SectionBuilder,
    ThumbnailBuilder
} = require('discord.js');

class CustomEmbedBuilder {
    constructor() {
        this.defaultColor = '#5865F2';
        this.successColor = '#57F287';
        this.errorColor = '#ED4245';
        this.warningColor = '#FEE75C';
    }

    createContainer(color = null) {
        return new ContainerBuilder();
    }

    create(options = {}) {
        const container = this.createContainer(options.color);

        // Add title if provided
        if (options.title) {
            const titleText = new TextDisplayBuilder()
                .setContent(`## ${options.title}`);
            container.addTextDisplayComponents(titleText);

            if (options.description || options.fields) {
                container.addSeparatorComponents(new SeparatorBuilder());
            }
        }

        // Add description if provided
        if (options.description) {
            const descText = new TextDisplayBuilder()
                .setContent(options.description);

            if (options.thumbnail || options.image) {
                const section = new SectionBuilder()
                    .addTextDisplayComponents(descText);

                if (options.thumbnail) {
                    const thumbnail = new ThumbnailBuilder({ 
                        media: { url: options.thumbnail } 
                    });
                    section.setThumbnailAccessory(thumbnail);
                }

                container.addSectionComponents(section);
            } else {
                container.addTextDisplayComponents(descText);
            }
        }

        // Add fields if provided
        if (options.fields && Array.isArray(options.fields)) {
            options.fields.forEach(field => {
                if (field.name) {
                    const fieldText = new TextDisplayBuilder()
                        .setContent(`**${field.name}**\n${field.value || ''}`);
                    container.addTextDisplayComponents(fieldText);
                }
            });
        }

        // Add footer if provided
        if (options.footer) {
            container.addSeparatorComponents(new SeparatorBuilder());
            const footerText = new TextDisplayBuilder()
                .setContent(`> ${options.footer.text || options.footer}`);
            container.addTextDisplayComponents(footerText);
        }

        return { 
            components: [container], 
            flags: MessageFlags.IsComponentsV2 
        };
    }

    success(description, title = '✅ Success') {
        const container = this.createContainer();

        const header = new TextDisplayBuilder()
            .setContent(`## ${title}`);
        container.addTextDisplayComponents(header);

        container.addSeparatorComponents(new SeparatorBuilder());

        const successText = new TextDisplayBuilder()
            .setContent(`> ${description}`);
        container.addTextDisplayComponents(successText);

        return { 
            components: [container], 
            flags: MessageFlags.IsComponentsV2 
        };
    }

    error(description, title = '❌ Error') {
        const container = this.createContainer();

        const header = new TextDisplayBuilder()
            .setContent(`## ${title}`);
        container.addTextDisplayComponents(header);

        container.addSeparatorComponents(new SeparatorBuilder());

        const errorText = new TextDisplayBuilder()
            .setContent(`> ${description}`);
        container.addTextDisplayComponents(errorText);

        return { 
            components: [container], 
            flags: MessageFlags.IsComponentsV2 
        };
    }

    warning(description, title = '⚠️ Warning') {
        const container = this.createContainer();

        const header = new TextDisplayBuilder()
            .setContent(`## ${title}`);
        container.addTextDisplayComponents(header);

        container.addSeparatorComponents(new SeparatorBuilder());

        const warningText = new TextDisplayBuilder()
            .setContent(`> ${description}`);
        container.addTextDisplayComponents(warningText);

        return { 
            components: [container], 
            flags: MessageFlags.IsComponentsV2 
        };
    }

    info(description, title = 'ℹ️ Information') {
        const container = this.createContainer();

        const header = new TextDisplayBuilder()
            .setContent(`## ${title}`);
        container.addTextDisplayComponents(header);

        container.addSeparatorComponents(new SeparatorBuilder());

        const infoText = new TextDisplayBuilder()
            .setContent(`> ${description}`);
        container.addTextDisplayComponents(infoText);

        return { 
            components: [container], 
            flags: MessageFlags.IsComponentsV2 
        };
    }
}

module.exports = new CustomEmbedBuilder();
