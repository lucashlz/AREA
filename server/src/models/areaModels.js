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

const TriggerSchema = new Schema({
    service: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    parameters: [ParameterSchema],
});

const ActionSchema = new Schema({
    service: {
        type: String,
        required: true,
    },
    name: {
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
    triggers: [TriggerSchema],
    actions: [ActionSchema],
});

const AreaModel = mongoose.model("Area", AreaSchema);

module.exports = {
    Area: AreaModel,
    Trigger: mongoose.model("Trigger", TriggerSchema),
    Action: mongoose.model("Action", ActionSchema),
    Parameter: mongoose.model("Parameter", ParameterSchema)
};
