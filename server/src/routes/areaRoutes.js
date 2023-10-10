const express = require("express");
const router = express.Router();
const areaController = require("../controllers/areaController");

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
 *     Area:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           format: uuid
 *           description: The user's unique identifier.
 *         triggers:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Trigger'
 *         actions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Action'
 *
 * /areas:
 *   get:
 *     summary: List all available areas
 *     tags: [areas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all areas returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Area'
 *       500:
 *         description: Server error
 */
router.get("/", areaController.listAllAreas);

/**
 * @swagger
 * /areas:
 *   post:
 *     summary: Create a new area by specifying the services, names, and parameters for action and reactions
 *     tags: [areas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               action:
 *                 type: object
 *                 properties:
 *                   service:
 *                     type: string
 *                     description: The name of the service for the action (e.g., "github", "spotify")
 *                   name:
 *                     type: string
 *                     description: The name of the selected action within the action service
 *                   parameters:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                         input:
 *                           type: string
 *                     description: The parameters required for the selected action
 *               reactions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     service:
 *                       type: string
 *                       description: The name of the service for the reaction (e.g., "github", "spotify")
 *                     name:
 *                       type: string
 *                       description: The name of the selected reaction within the reaction service
 *                     parameters:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                           input:
 *                             type: string
 *                       description: The parameters required for the selected reaction
 *     responses:
 *       200:
 *         description: Area created successfully
 *       400:
 *         description: Bad Request (e.g., Specified service/action/reaction does not exist, Invalid parameters)
 *       404:
 *         description: User not found
 *       409:
 *         description: Area with these parameters already exists
 *       500:
 *         description: Server error
 */
router.post("/", areaController.createArea);

/**
 * @swagger
 * /areas/{id}:
 *   get:
 *     summary: Get a specific area by its ID
 *     tags: [areas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the area
 *     responses:
 *       200:
 *         description: Area details returned successfully
 *       404:
 *         description: Area not found for the given ID
 *       500:
 *         description: Server error
 */
router.get("/:id", areaController.getAreaById);

/**
 * @swagger
 * /areas/{id}:
 *   put:
 *     summary: Update an area by its ID
 *     tags: [areas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the area
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               actionService:
 *                 type: string
 *                 description: The name of the service for the action (e.g., "github", "spotify")
 *               reactionService:
 *                 type: string
 *                 description: The name of the service for the reaction (e.g., "github", "spotify")
 *               actionName:
 *                 type: string
 *                 description: The name of the selected action within the action service
 *               reactionName:
 *                 type: string
 *                 description: The name of the selected reaction within the reaction service
 *               actionParameters:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     input:
 *                       type: string
 *                 description: The parameters required for the selected action
 *               reactionParameters:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     input:
 *                       type: string
 *                 description: The parameters required for the selected reaction
 *     responses:
 *       200:
 *         description: Area updated successfully
 *       400:
 *         description: Invalid services provided, specified action or reaction does not exist, or other bad request scenarios
 *       404:
 *         description: Area or user not found for the given ID
 *       500:
 *         description: Server error
 */
router.put("/:id", areaController.updateAreaById);

/**
 * @swagger
 * /areas/{id}:
 *   delete:
 *     summary: Delete an area by its ID
 *     tags: [areas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the area
 *     responses:
 *       200:
 *         description: Area deleted successfully
 *       404:
 *         description: Area not found for the given ID
 *       500:
 *         description: Server error
 */
router.delete("/:id", areaController.deleteAreaById);

module.exports = router;
