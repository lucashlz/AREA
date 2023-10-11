const mongoose = require("mongoose");
const { Schema } = mongoose;

/**
 * @swagger
 * components:
 *   schemas:
 *     Parameter:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the parameter.
 *         input:
 *           type: string
 *           description: The input value of the parameter.
 */
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

/**
 * @swagger
 * components:
 *   schemas:
 *     Trigger:
 *       type: object
 *       properties:
 *         service:
 *           type: string
 *           description: The service name.
 *         name:
 *           type: string
 *           description: The name of the trigger.
 *         parameters:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Parameter'
 */
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

/**
 * @swagger
 * components:
 *   schemas:
 *     Action:
 *       type: object
 *       properties:
 *         service:
 *           type: string
 *           description: The service name.
 *         name:
 *           type: string
 *           description: The name of the action.
 *         parameters:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Parameter'
 */
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

/**
 * @swagger
 * components:
 *   schemas:
 *     Area:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: The user's unique identifier.
 *         triggers:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Trigger'
 *         actions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Action'
 */
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
