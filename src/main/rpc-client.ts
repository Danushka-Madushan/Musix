import DiscordRPC from 'discord-rpc'

const clientId = '1201497507893612655';

DiscordRPC.register(clientId);

export const rpc = new DiscordRPC.Client({ transport: 'ipc' });

let isFaield = false

export const setActivity = (args: DiscordRPC.Presence | false): void => {
  if (!rpc || !args || isFaield) {
    return;
  }

  rpc.setActivity(args);
}

rpc.login({ clientId }).catch(() => {
  console.log('RPC Client Failed')
  isFaield = true
});
