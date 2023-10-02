const mongoose = require("mongoose");
const AREAS = require("./areaServices");

async function executeReaction(areaEntry, associatedReaction) {
    const userParameters = areaEntry.parameters;
    try {
        await associatedReaction.actionFunction(areaEntry.userId, ...Object.values(userParameters));
    } catch (error) {
        console.error("Failed to execute reaction:", error);
    }
}

exports.checkAndReact = async () => {
    try {
        const activeServiceAreas = await mongoose.model("Area").find({ isActive: true });

        for (const areaEntry of activeServiceAreas) {
            const platformService = AREAS[areaEntry.service];

            if (!platformService) continue;
            const detectedTrigger = platformService.actions.find(
                (t) => t.name === areaEntry.action.name
            );
            const associatedReaction = platformService.reactions.find(
                (r) => r.name === areaEntry.reaction.name
            );

            if (detectedTrigger && associatedReaction) {
                const userParameters = areaEntry.parameters;
                const hasTriggered = await detectedTrigger.triggerFunction(
                    areaEntry.userId,
                    userParameters.lastCount || userParameters.lastTopTrackId
                );

                if (hasTriggered) {
                    await executeReaction(areaEntry, associatedReaction);
                }
            }
        }
    } catch (error) {
        console.error("Error during trigger evaluation:", error);
    }
}
