const mongoose = require("mongoose");
const AREAS = require("./areaServices");

async function executeReaction(areaEntry, associatedReaction, reactionParameters) {
    const userParameters = areaEntry.parameters;
    try {
        await associatedReaction.actionFunction(
            areaEntry.userId,
            ...Object.values(userParameters),
            ...reactionParameters
        );
        console.log(`Successfully executed reaction for area ID: ${areaEntry._id}`);
    } catch (error) {
        console.error("Failed to execute reaction:", error);
    }
}

exports.checkAndReact = async () => {
    try {
        const activeServiceAreas = await mongoose.model("Area").find({});

        if (activeServiceAreas.length === 0) {
            console.log("No service areas found.");
            return;
        }
        for (const areaEntry of activeServiceAreas) {
            const platformService = AREAS[areaEntry.triggers[0].service];
            if (!platformService) continue;
            const detectedTrigger = platformService.triggers.find(
                (t) => t.name === areaEntry.triggers[0].name
            );
            const associatedReaction = platformService.actions.find(
                (r) => r.name === areaEntry.actions[0].name
            );
            if (detectedTrigger && associatedReaction) {
                const triggerParameters =
                    areaEntry.triggers[0].parameters.length > 0
                        ? areaEntry.triggers[0].parameters[0]
                        : {};
                const hasTriggered = await detectedTrigger.triggerFunction(
                    areaEntry.userId,
                    triggerParameters.lastCount || triggerParameters.lastTopTrackId
                );

                if (hasTriggered) {
                    const reactionParameters =
                        areaEntry.actions[0].parameters.length > 0
                            ? areaEntry.actions[0].parameters
                            : [];
                    await executeReaction(areaEntry, associatedReaction, ...reactionParameters);
                }
            }
        }
    } catch (error) {
        console.error("Error during trigger evaluation:", error);
    }
};
