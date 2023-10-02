const AREAS = require("../core/areaServices");

exports.getInfo = (req, res) => {
    try {
        const services = Object.keys(AREAS).map((areaKey) => {
            const area = AREAS[areaKey];

            return {
                name: areaKey,
                color: area.color,
                actions: area.actions.map((action) => ({
                    name: action.name,
                    description: action.description,
                    parameters: action.parameters,
                })),
                reactions: area.reactions.map((reaction) => ({
                    name: reaction.name,
                    description: reaction.description,
                    parameters: reaction.parameters,
                })),
            };
        });

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
