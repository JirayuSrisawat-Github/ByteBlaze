import { EmbedBuilder, CommandInteraction, GuildMember } from "discord.js";
import { Manager } from "../../../manager.js";
import { Accessableby, SlashCommand } from "../../../@types/Command.js";

// Main code
export default class implements SlashCommand {
  name = ["loopall"];
  description = "Loop all songs in queue!";
  category = "Music";
  accessableby = Accessableby.Member;
  lavalink = true;
  options = [];

  async run(
    interaction: CommandInteraction,
    client: Manager,
    language: string
  ) {
    await interaction.deferReply({ ephemeral: false });
    const msg = await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setDescription(
            `${client.i18n.get(language, "music", "loopall_loading")}`
          )
          .setColor(client.color),
      ],
    });

    const player = client.manager.players.get(interaction.guild!.id);
    if (!player)
      return msg.edit({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `${client.i18n.get(language, "noplayer", "no_player")}`
            )
            .setColor(client.color),
        ],
      });
    const { channel } = (interaction.member as GuildMember)!.voice;
    if (
      !channel ||
      (interaction.member as GuildMember)!.voice.channel !==
        interaction.guild!.members.me!.voice.channel
    )
      return msg.edit({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `${client.i18n.get(language, "noplayer", "no_voice")}`
            )
            .setColor(client.color),
        ],
      });
    if (player.loop === "queue") {
      await player.setLoop("none");

      const unloopall = new EmbedBuilder()
        .setDescription(`${client.i18n.get(language, "music", "unloopall")}`)
        .setColor(client.color);

      return msg.edit({ content: " ", embeds: [unloopall] });
    } else if (player.loop === "none") {
      await player.setLoop("queue");

      const loopall = new EmbedBuilder()
        .setDescription(`${client.i18n.get(language, "music", "loopall")}`)
        .setColor(client.color);

      return msg.edit({ content: " ", embeds: [loopall] });
    }
  }
}
