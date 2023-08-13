import { KazagumoPlayer } from "kazagumo";
import { Manager } from "../../manager.js";

export default async (client: Manager, player: KazagumoPlayer) => {
  const guild = await client.guilds.cache.get(player.guildId);
  let data = await client.db.get(`autoreconnect.guild_${player.guildId}`);

  if (player.data.get("autoplay") === true) {
    const requester = player.data.get("requester");
    const identifier = player.data.get("identifier");
    const search = `https://www.youtube.com/watch?v=${identifier}&list=RD${identifier}`;
    let res = await player.search(search, { requester: requester });
    player.queue.add(res.tracks[2]);
    player.queue.add(res.tracks[3]);
    player.play();
    return;
  }

  client.logger.info(`Player Empty in @ ${guild!.name} / ${player.guildId}`);
  if (data) return;

  await player.destroy();
  if (client.websocket)
    client.websocket.send(
      JSON.stringify({ op: "player_destroy", guild: player.guildId }),
    );
};