const {
    Embed, ButtonComponent, ActionRow,
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

    let buttonList = [new ButtonComponent().setCustomId("tobeginning").setStyle(1).setEmoji({name: "tobeginning", id: "947923816129130556", animated: false}), new ButtonComponent().setCustomId("last").setStyle(1).setEmoji({name: "arrowleft", id: "947923816062013471", animated: false}), new ButtonComponent().setCustomId("discard").setEmoji({name: "x_", id: "947923816120733747", animated: false}).setStyle(4), new ButtonComponent().setCustomId("next").setEmoji({name: "arrowright", id: "947923816363982888", animated: false}).setStyle(1), new ButtonComponent().setCustomId("toend").setEmoji({name: "toend", id: "947923816158494831", animated: false}).setStyle(1)];

    let page = 0;

    const row = new ActionRow().addComponents(new ButtonComponent()
        .setCustomId("tobeginning")
        .setStyle(1)
        .setEmoji({name: "tobeginning", id: "947923816129130556", animated: false}), new ButtonComponent()
        .setCustomId("last")
        .setStyle(1)
        .setEmoji({name: "arrowleft", id: "947923816062013471", animated: false}), new ButtonComponent()
        .setCustomId("discard")
        .setEmoji({name: "x_", id: "947923816120733747", animated: false})
        .setStyle(4), new ButtonComponent()
        .setCustomId("next")
        .setEmoji({name: "arrowright", id: "947923816363982888", animated: false})
        .setStyle(1), new ButtonComponent()
        .setCustomId("toend")
        .setEmoji({name: "toend", id: "947923816158494831", animated: false})
        .setStyle(1));

    //has the interaction already been deferred? If not, defer the reply.

    if (interaction.deferred == false) {
        await interaction.deferReply();
    }

    const curPage = await interaction.editReply({
        content: `Page ${page + 1} / ${pages.length}`, embeds: [pages[page]], components: [row], fetchReply: true,
    });

    const filter = (i) => i != null

    const collector = await curPage.createMessageComponentCollector({
        filter, time: timeout,
    });

    collector.on("collect", async (i) => {
        console.log(i.customId);
        switch (i.customId) {
            case "tobeginning":
                page = 0;
                break;
            case "last":
                page = page > 0 ? --page : pages.length - 1;
                break;
            case "next":
                page = page + 1 < pages.length ? ++page : 0;
                break;
            case "toend":
                page = pages.length - 1;
                break;
            case "discard":
                await interaction.deleteReply();
                return;
            default:
                break;
        }
        await i.deferUpdate();
        await i.editReply({
            content: `Page ${page + 1} / ${pages.length}`, embeds: [pages[page]], components: [row],
        });
        collector.resetTimer();
    });

    collector.on("end", () => {
        try {
            if (!curPage.deleted) {
                const disabledRow = new ActionRow().addComponents(buttonList[0].setDisabled(true), buttonList[1].setDisabled(true), buttonList[2].setDisabled(true), buttonList[3].setDisabled(true), buttonList[4].setDisabled(true));
                curPage.edit({
                    content: `Page ${page + 1} / ${pages.length}`, embeds: [pages[page]], components: [disabledRow],
                });
            }
        } catch {
        }
    });
    return curPage;
};

// usage: paginationEmbed(interaction, embeds, buttons, timeOut)
// timeout and buttons (a list of 5 buttons, really) are optional
module.exports = paginationEmbed;
