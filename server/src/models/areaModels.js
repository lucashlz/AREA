const mongoose = require("mongoose");
const { Schema } = mongoose;

const ParameterSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    input: {
        type: String,
        required: true,
    }
});

const ActionSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    parameters: [ParameterSchema],
});

const ReactionSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    parameters: [ParameterSchema],
});

const AreaSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    actions: [ActionSchema],
    reactions: [ReactionSchema],
});

const AreaModel = mongoose.model("Area", AreaSchema);

module.exports = {
    Area: AreaModel,
    Action: mongoose.model("Action", ActionSchema),
    Reaction: mongoose.model("Reaction", ReactionSchema),
    Parameter: mongoose.model("Parameter", ParameterSchema)
};
