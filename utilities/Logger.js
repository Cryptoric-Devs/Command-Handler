const chalk = require('chalk');
const ascii = require('ascii-art');

class Logger {
    constructor() {
        this.colors = {
            info: chalk.cyan,
            success: chalk.green,
            warn: chalk.yellow,
            error: chalk.red,
            debug: chalk.magenta,
            shard: chalk.blue,
            command: chalk.greenBright,
            component: chalk.yellowBright
        };
    }

    async printBanner(config) {
        return new Promise((resolve) => {
            const botName = config?.bot?.name || 'Npg';
            const ownerName = config?.bot?.owner || 'Npg';
            const version = config?.bot?.version || '2.0.0';
            
            ascii.font(botName, 'Doom', (err, rendered) => {
                if (err) {
                    console.log(chalk.bold.cyan('='.repeat(60)));
                    console.log(chalk.bold.cyan(`${botName.toUpperCase()} DISCORD BOT`));
                    console.log(chalk.bold.cyan('='.repeat(60)));
                    console.log(chalk.cyan(`  Bot Name:    ${chalk.white.bold(botName)}`));
                    console.log(chalk.cyan(`  Owner:       ${chalk.white.bold(ownerName)}`));
                    console.log(chalk.cyan(`  Version:     ${chalk.white.bold(version)}`));
                    console.log(chalk.cyan(`  Framework:   ${chalk.white.bold('Discord.js v14')}`));
                    console.log(chalk.cyan(`  Sharding:    ${chalk.white.bold('Discord-Hybrid-Sharding')}`));
                    console.log(chalk.bold.cyan('='.repeat(60)));
                    return resolve();
                }
                
                console.log(chalk.bold.cyan(rendered));
                console.log(chalk.bold.cyan('='.repeat(60)));
                console.log(chalk.cyan(`  Bot Name:    ${chalk.white.bold(botName)}`));
                console.log(chalk.cyan(`  Owner:       ${chalk.white.bold(ownerName)}`));
                console.log(chalk.cyan(`  Version:     ${chalk.white.bold(version)}`));
                console.log(chalk.cyan(`  Framework:   ${chalk.white.bold('Discord.js v14')}`));
                console.log(chalk.cyan(`  Sharding:    ${chalk.white.bold('Discord-Hybrid-Sharding')}`));
                console.log(chalk.bold.cyan('='.repeat(60)));
                resolve();
            });
        });
    }

    printShardInfo(shardId, totalShards) {
        console.log(chalk.blue.bold(`\n[SHARD ${shardId}/${totalShards}]`) + chalk.blue(' Starting shard...'));
    }

    info(message, shard = null) {
        const prefix = shard !== null ? `[SHARD ${shard}]` : '[INFO]';
        console.log(`${this.colors.info(prefix)} ${message}`);
    }

    success(message, shard = null) {
        const prefix = shard !== null ? `[SHARD ${shard}]` : '[SUCCESS]';
        console.log(`${this.colors.success(prefix)} ${chalk.white(message)}`);
    }

    warn(message, shard = null) {
        const prefix = shard !== null ? `[SHARD ${shard}]` : '[WARN]';
        console.log(`${this.colors.warn(prefix)} ${message}`);
    }

    error(message, error = null, shard = null) {
        const prefix = shard !== null ? `[SHARD ${shard}]` : '[ERROR]';
        console.log(`${this.colors.error(prefix)} ${message}`);
        if (error) {
            console.log(this.colors.error(error.stack || error));
        }
    }

    debug(message, shard = null) {
        const prefix = shard !== null ? `[SHARD ${shard}]` : '[DEBUG]';
        console.log(`${this.colors.debug(prefix)} ${message}`);
    }

    command(commandName, user, guild, shard = null) {
        const prefix = shard !== null ? `[SHARD ${shard}]` : '[COMMAND]';
        console.log(`${this.colors.command(prefix)} ${chalk.white(commandName)} executed by ${chalk.yellow(user)} in ${chalk.cyan(guild)}`);
    }

    component(componentId, user, shard = null) {
        const prefix = shard !== null ? `[SHARD ${shard}]` : '[COMPONENT]';
        console.log(`${this.colors.component(prefix)} ${chalk.white(componentId)} used by ${chalk.yellow(user)}`);
    }

    shardReady(shardId, totalShards) {
        console.log(chalk.green.bold(`\n✓ [SHARD ${shardId}/${totalShards}] Ready!`));
    }

    clusterReady(clusterId, totalClusters) {
        console.log(chalk.green.bold(`\n✓ [CLUSTER ${clusterId}/${totalClusters}] All shards ready!`));
    }
}

module.exports = new Logger();
