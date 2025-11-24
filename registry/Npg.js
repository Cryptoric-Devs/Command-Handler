const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const logger = require('../utilities/Logger');

class NpgRegistry {
    constructor() {
        this.commands = [];
        this.commandsPath = path.join(__dirname, '../modules/commands');
    }

    loadCommandsRecursive(dir) {
        const files = fs.readdirSync(dir);
        
        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            
            if (stat.isDirectory()) {
                this.loadCommandsRecursive(filePath);
            } else if (file.endsWith('.js')) {
                const command = require(filePath);
                if (command.data) {
                    this.commands.push(command.data.toJSON());
                    logger.debug(`Registered: ${command.data.name}`);
                }
            }
        }
    }

    async deployCommands(token, clientId, guildId = null) {
        try {
            const config = require('../config');
            await logger.printBanner(config);
            
            logger.info('Loading commands for deployment...');
            this.commands = [];
            this.loadCommandsRecursive(this.commandsPath);
            logger.success(`Loaded ${this.commands.length} slash commands for deployment`);

            const rest = new REST().setToken(token);

            logger.info('Starting command deployment...');

            if (guildId) {
                logger.info(`Deploying to guild: ${guildId}`);
                await rest.put(
                    Routes.applicationGuildCommands(clientId, guildId),
                    { body: this.commands }
                );
                logger.success(`Successfully deployed ${this.commands.length} commands to guild!`);
            } else {
                logger.info('Deploying globally...');
                await rest.put(
                    Routes.applicationCommands(clientId),
                    { body: this.commands }
                );
                logger.success(`Successfully deployed ${this.commands.length} commands globally!`);
                logger.warn('Global commands may take up to 1 hour to update.');
            }

            return true;
        } catch (error) {
            logger.error('Failed to deploy commands:', error);
            return false;
        }
    }

    async deleteCommand(token, clientId, commandId, guildId = null) {
        try {
            const rest = new REST().setToken(token);

            if (guildId) {
                await rest.delete(Routes.applicationGuildCommand(clientId, guildId, commandId));
                logger.success(`Deleted guild command: ${commandId}`);
            } else {
                await rest.delete(Routes.applicationCommand(clientId, commandId));
                logger.success(`Deleted global command: ${commandId}`);
            }

            return true;
        } catch (error) {
            logger.error('Failed to delete command:', error);
            return false;
        }
    }

    async deleteAllCommands(token, clientId, guildId = null) {
        try {
            const rest = new REST().setToken(token);

            if (guildId) {
                await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] });
                logger.success('Deleted all guild commands');
            } else {
                await rest.put(Routes.applicationCommands(clientId), { body: [] });
                logger.success('Deleted all global commands');
            }

            return true;
        } catch (error) {
            logger.error('Failed to delete commands:', error);
            return false;
        }
    }

    getCommands() {
        return this.commands;
    }

    getCommandCount() {
        return this.commands.length;
    }
}

module.exports = new NpgRegistry();
