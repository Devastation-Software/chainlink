const {
  MessageActionRow,
  Message,
  MessageEmbed,
  MessageButton,
} = require("discord.js");

const {
  Embed
} = require("@discordjs/builders");

module.exports = async function confirmEmbed(
  interaction,
  title,
  awaitDesc,
  successDesc,
  failDesc
) {
  return new Promise(async (resolve, reject) => {
    let buttonList = [
      new MessageButton()
        .setCustomId("yes")
        .setStyle("SUCCESS")
        .setLabel("Yes"),
      new MessageButton().setCustomId("no").setStyle("DANGER").setLabel("No"),
    ];
    let Embed = new MessageEmbed()
      .setTitle(title)
      .setDescription(awaitDesc)
      .setColor("#FFFF00");

    const row = new MessageActionRow().addComponents(buttonList);

    await interaction.deferReply();

    const curPage = await interaction.editReply({
      embeds: [embed],
      components: [row],
    });

    const filter = (i) =>
      i.customId === buttonList[0].customId ||
      i.customId === buttonList[1].customId;

    const collector = await curPage.createMessageComponentCollector({
      filter,
      time: 30_000,
    });

    collector.on("collect", async (i) => {
      let newEmbed = new MessageEmbed();
      if (i.customId == "no") {
        newEmbed
          .setTitle("Canceled")
          .setDescription(failDesc)
          .setColor("#FF0000");
      }
      if (i.customId == "yes") {
        newEmbed
          .setTitle("Success")
          .setDescription(successDesc)
          .setColor("#00FF00");
      }
      await i.deferUpdate();
      if (!curPage.deleted) {
        const disabledRow = new MessageActionRow().addComponents(
          buttonList[0].setDisabled(true),
          buttonList[1].setDisabled(true)
        );
        i.editReply({
          embeds: [newEmbed],
          components: [disabledRow],
        });
      }
      if (i.customId == "no") {
        resolve(false);
      }
      if (i.customId == "yes") {
        resolve(true);
      }
    });

    collector.on("end", async () => {
      if (!curPage.deleted) {
        const disabledRow = new MessageActionRow().addComponents(
          buttonList[0].setDisabled(true),
          buttonList[1].setDisabled(true)
        );
        let embed = new MessageEmbed()
          .setTitle("Timed Out")
          .setDescription("This command has timed out.")
          .setColor("#FF8800");
        curPage.edit({
          embeds: [embed],
          components: [disabledRow],
        });
      }
      resolve(false);
    });
    return curPage;
  });
};
