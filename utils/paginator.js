const {
  Embed,
    ButtonComponent,
    ActionRow,
} = require("@discordjs/builders");

/**
 * Creates a pagination embed
 * @param {Interaction} interaction
 * @param {Embed[]} pages
 * @param {MessageButton[]} buttonList
 * @param {number} timeout
 * @returns
 */
const paginationEmbed = async (interaction, pages, timeout = 120000) => {
  if (!pages) throw new Error("No pages for paginationEmbed!.");
  buttonList = [
    new ButtonComponent()
      .setCustomId("tobeginning")
      .setStyle("PRIMARY")
      .setEmoji("947923816129130556"),
    new ButtonComponent()
      .setCustomId("last")
      .setStyle("PRIMARY")
      .setEmoji("947923816062013471"),
    new ButtonComponent()
      .setCustomId("discard")
      .setEmoji("947923816120733747")
      .setStyle("DANGER"),
    new ButtonComponent()
      .setCustomId("next")
      .setEmoji("947923816363982888")
      .setStyle("PRIMARY"),
    new ButtonComponent()
      .setCustomId("toend")
      .setEmoji("947923816158494831")
      .setStyle("PRIMARY"),
  ];

  let page = 0;

  const row = new ActionRow().addComponents(buttonList);

  //has the interaction already been deferred? If not, defer the reply.

  if (interaction.deferred == false) {
    await interaction.deferReply();
  }

  const curPage = await interaction.editReply({
    embeds: [pages[page].setFooter(`Page ${page + 1} / ${pages.length}`)],
    components: [row],
    fetchReply: true,
  });

  const filter = (i) =>
    i.customId === buttonList[0].customId ||
    i.customId === buttonList[1].customId ||
    i.customId === buttonList[2].customId ||
    i.customId === buttonList[3].customId ||
    i.customId === buttonList[4].customId;

  const collector = await curPage.createMessageComponentCollector({
    filter,
    time: timeout,
  });

  collector.on("collect", async (i) => {
    switch (i.customId) {
      case buttonList[0].customId:
        page = 0;
        break;
      case buttonList[1].customId:
        page = page > 0 ? --page : pages.length - 1;
        break;
      case buttonList[3].customId:
        page = page + 1 < pages.length ? ++page : 0;
        break;
      case buttonList[4].customId:
        page = pages.length - 1;
        break;
      case buttonList[2].customId:
        await interaction.deleteReply();
        return;
      default:
        break;
    }
    await i.deferUpdate();
    await i.editReply({
      embeds: [pages[page].setFooter(`Page ${page + 1} / ${pages.length}`)],
      components: [row],
    });
    collector.resetTimer();
  });

  collector.on("end", () => {
    try {
      if (!curPage.deleted) {
        const disabledRow = new ActionRow().addComponents(
          buttonList[0].setDisabled(true),
          buttonList[1].setDisabled(true),
          buttonList[2].setDisabled(true),
          buttonList[3].setDisabled(true),
          buttonList[4].setDisabled(true)
        );
        curPage.edit({
          embeds: [pages[page].setFooter(`Page ${page + 1} / ${pages.length}`)],
          components: [disabledRow],
        });
      }
    } catch {}
  });
  return curPage;
};

// usage: paginationEmbed(interaction, embeds, buttons, timeOut)
// timeout and buttons (a list of 5 buttons, really) are optional
module.exports = paginationEmbed;
