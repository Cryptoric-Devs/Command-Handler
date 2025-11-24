const { ClusterManager } = require('discord-hybrid-sharding');
const logger = require('./utilities/Logger');
const config = require('./config');

async function startClusters() {
    await logger.printBanner(config);

    const manager = new ClusterManager('./core/bot.js', {
        totalShards: config.sharding.totalShards,
        shardsPerClusters: config.sharding.shardsPerClusters,
        mode: config.sharding.mode,
        token: config.sharding.token
    });

    manager.on('clusterCreate', cluster => {
        logger.info(`Launched Cluster ${cluster.id}`, cluster.id);
        
        cluster.on('ready', () => {
            logger.clusterReady(cluster.id, manager.totalClusters);
        });

        cluster.on('death', () => {
            logger.warn(`Cluster ${cluster.id} died`, cluster.id);
        });

        cluster.on('error', (error) => {
            logger.error(`Cluster ${cluster.id} error:`, error, cluster.id);
        });

        cluster.on('disconnect', () => {
            logger.warn(`Cluster ${cluster.id} disconnected`, cluster.id);
        });

        cluster.on('reconnecting', () => {
            logger.info(`Cluster ${cluster.id} reconnecting`, cluster.id);
        });

        cluster.on('message', (message) => {
            if (message._sEval) return;
            logger.debug(`Message from Cluster ${cluster.id}: ${JSON.stringify(message)}`, cluster.id);
        });
    });

    manager.spawn({ timeout: -1 }).catch(error => {
        logger.error('Error spawning clusters:', error);
        process.exit(1);
    });
}

startClusters();
