const mongoose = require("mongoose");
const AREAS = require("./areaServices");

async function executeReaction(areaEntry, associatedReaction, reactionParameters) {
    console.log("REACTION !!!!");
    console.log("areaEntry:", areaEntry);
    for (const action of areaEntry.actions) {
        const paramsValues = action.parameters || [];
        console.log("Action Parameters:", paramsValues);
        try {
            await associatedReaction.actionFunction(areaEntry.userId, ...paramsValues.map((param) => param.input), ...reactionParameters);
            console.log(`Successfully executed reaction for area ID: ${areaEntry._id}`);
        } catch (error) {
            console.error("Failed to execute reaction:", error);
        }
    }
}

exports.checkAndReact = async () => {
    try {
        const activeServiceAreas = await mongoose.model("Area").find({ isActive: true });
        if (activeServiceAreas.length === 0) {
            console.log("No service areas found.");
            return;
        }
        for (const areaEntry of activeServiceAreas) {
            const triggerService = AREAS[areaEntry.trigger.service];
            if (!triggerService) {
                console.warn(`Trigger Service not found for ${areaEntry.trigger.service}`);
                continue;
            }
            const detectedTrigger = triggerService.triggers.find((t) => t.name === areaEntry.trigger.name);
            if (!detectedTrigger) {
                console.warn(`Trigger not found for ${areaEntry.trigger.name}`);
                continue;
            }

            const hasTriggered = await detectedTrigger.triggerFunction(areaEntry);
            if (!hasTriggered) continue;
            for (const action of areaEntry.actions) {
                const actionService = AREAS[action.service];
                if (!actionService) {
                    console.warn(`Action Service not found for ${action.service}`);
                    continue;
                }
                const associatedReaction = actionService.actions.find((r) => r.name === action.name);
                if (!associatedReaction) {
                    console.warn(`Reaction not found for ${action.name}`);
                    continue;
                }
                try {
                    const reactionParameters = action.parameters.length > 0 ? action.parameters : [];
                    await executeReaction(areaEntry, associatedReaction, reactionParameters);
                } catch (reactionError) {
                    console.error("Error during reaction execution:", reactionError);
                }
            }
        }
    } catch (error) {
        console.error("Error during overall trigger evaluation:", error);
    }
};
