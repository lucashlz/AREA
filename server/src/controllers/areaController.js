const { Area } = require("../models/areaModels");
const User = require("../models/userModels");
const AREAS = require("../core/areaServices");
const { checkParameters } = require("../utils/areaUtils");

exports.listAllAreas = async (req, res) => {
    try {
        const areas = await Area.find({ userId: req.user.id }).select('-userId');
        res.status(200).json(areas);
    } catch (error) {
        res.status(500).json({ message: "Error fetching areas", error });
    }
};

exports.createArea = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        const { trigger, actions } = req.body;
        const triggerServiceObj = AREAS[trigger.service];
        if (!triggerServiceObj) {
            return res.status(400).json({ message: "Invalid trigger service provided." });
        }
        const triggerObj = triggerServiceObj.triggers.find((t) => t.name === trigger.name);
        if (!triggerObj) {
            return res.status(400).json({ message: "Invalid trigger provided." });
        }
        if (!(await checkParameters(req.user.id, trigger, actions))) {
            return res.status(400).json({ message: "Invalid parameters provided." });
        }
        const newArea = new Area({
            userId: user._id,
            triggers: [
                {
                    service: trigger.service,
                    name: trigger.name,
                    parameters: trigger.parameters,
                },
            ],
            actions: actions.map((a) => ({
                service: a.service,
                name: a.name,
                parameters: a.parameters,
            })),
        });

        const savedArea = await newArea.save();
        res.status(200).json(savedArea);
    } catch (error) {
        console.error("Detailed Error:", error);
        res.status(500).json({ message: "Error creating the area", error });
    }
};


exports.getAreaById = async (req, res) => {
    const id = req.params.id;
    try {
        const area = await Area.findById(id);
        if (area) {
            res.status(200).json(area);
        } else {
            res.status(404).json({ message: "Area not found for the given ID" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching the area", error });
    }
};

exports.updateAreaById = async (req, res) => {
    const id = req.params.id;

    const {
        actionService,
        reactionService,
        actionName,
        reactionName,
        actionParameters,
        reactionParameters,
    } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const actionServiceObj = AREAS[actionService];
        const reactionServiceObj = AREAS[reactionService];

        if (!actionServiceObj || !reactionServiceObj) {
            return res.status(400).json({ message: "Invalid services provided." });
        }

        const action = actionServiceObj.actions.find((a) => a.name === actionName);
        const reaction = reactionServiceObj.reactions.find((r) => r.name === reactionName);

        if (!action || !reaction) {
            return res.status(400).json({ message: "Invalid action or reaction provided." });
        }

        const mapParameters = (provided, original) => {
            return original.map((param) => {
                const providedParam = provided.find((p) => p.name === param.name);
                return { ...param, input: providedParam ? providedParam.input : undefined };
            });
        };

        const updatedArea = await Area.findByIdAndUpdate(
            id,
            {
                userId: user._id,
                actions: [
                    { ...action, parameters: mapParameters(actionParameters, action.parameters) },
                ],
                reactions: [
                    {
                        ...reaction,
                        parameters: mapParameters(reactionParameters, reaction.parameters),
                    },
                ],
            },
            { new: true }
        );

        if (updatedArea) {
            res.status(200).json(updatedArea);
        } else {
            res.status(404).json({ message: "Area not found for the given ID" });
        }
    } catch (error) {
        console.error("Detailed Error:", error);
        res.status(500).json({ message: "Error updating the area", error });
    }
};

exports.deleteAreaById = async (req, res) => {
    const id = req.params.id;
    try {
        const deletedArea = await Area.findByIdAndDelete(id);
        if (deletedArea) {
            res.status(200).json({ message: "Area deleted successfully" });
        } else {
            res.status(404).json({ message: "Area not found for the given ID" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error deleting the area", error });
    }
};
