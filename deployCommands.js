require('dotenv').config();
const NpgRegistry = require('./registry/Npg');
const logger = require('./utilities/Logger');
const config = require('./config');

async function deploy() {
    await logger.printBanner(config);
    const success = await NpgRegistry.deployCommands(
        process.env.DISCORD_TOKEN,
        process.env.CLIENT_ID,
        process.env.TEST_GUILD_ID || null
    );

    if (!success) {
        process.exit(1);
    }
}

deploy();
