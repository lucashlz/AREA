const AREAS = require("../core/areaServices");

exports.getInfo = (req, res) => {
    try {
        const services = Object.keys(AREAS)
            .map((areaKey) => {
                const area = AREAS[areaKey];
                if (!area.triggers || !area.actions) {
                    console.error(`Area ${areaKey} is missing either triggers or actions`);
                    return null;
                }

                return {
                    name: areaKey,
                    color: area.color,
                    triggers: area.triggers.map((trigger) => ({
                        name: trigger.name,
                        description: trigger.description,
                        parameters: trigger.parameters,
                        ingredients: trigger.ingredients || [],
                    })),
                    actions: area.actions.map((action) => ({
                        name: action.name,
                        description: action.description,
                        parameters: action.parameters,
                    })),
                };
            })
            .filter(Boolean);
        res.status(200).json({
            client: {
                host: req.ip,
            },
            server: {
                current_time: Math.floor(Date.now() / 1000),
                services: services,
            },
        });
    } catch (error) {
        console.error("Error fetching about data:", error);
        res.status(500).json({ message: "Server error." });
    }
};
