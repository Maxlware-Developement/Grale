const RPC = require('discord-rpc');
const chalk = require('chalk');
chalk.level = 3;

const clientId = '1469091154040590509';
const startTimestamp = new Date();

const rpc = new RPC.Client({ transport: 'ipc' });

rpc.on('ready', () => {
  rpc.setActivity({
    details: 'Navigue avec Grale Browser',
    state: 'Disponible sur Github',
    startTimestamp,
    instance: false
  });
  console.log(chalk.green('[RPC] Online...'));
});

rpc.login({ clientId }).catch(console.error);

