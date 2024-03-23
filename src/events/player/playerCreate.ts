import { Manager } from "../../manager.js";
import { RainlinkPlayer } from "../../rainlink/main.js";

export default class {
  async execute(client: Manager, player: RainlinkPlayer) {
    const guild = await client.guilds.fetch(player.guildId);
    client.logger.info(import.meta.url, `Player Created in @ ${guild!.name} / ${player.guildId}`);
    client.emit("playerCreate", player.guildId);
  }
}
