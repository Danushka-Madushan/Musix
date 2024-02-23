import DiscordRPC from 'discord-rpc'

const clientId = '1201497507893612655';

// Only needed if you want to use spectate, join, or ask to join
DiscordRPC.register(clientId);

export const rpc = new DiscordRPC.Client({ transport: 'ipc' });

export const setActivity = (args: DiscordRPC.Presence | false): void => {
  if (!rpc || !args) {
    return;
  }
  // You'll need to have snek_large and snek_small assets uploaded to
  // https://discord.com/developers/applications/<application_id>/rich-presence/assets
  rpc.setActivity(args);
}

rpc.login({ clientId }).catch(() => {
  console.log('RPC Client Failed')
});
