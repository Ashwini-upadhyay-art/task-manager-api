const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const { validate, validateId, createTaskSchema, updateTaskSchema } = require('../middleware/validate');

router.post('/', validate(createTaskSchema), taskController.createTask);
router.get('/', taskController.getAllTask);
router.get('/:id', validateId, taskController.getTaskById);
router.patch('/:id', validateId, validate(updateTaskSchema), taskController.updateTask);
router.delete('/:id', validateId, taskController.deleteTask);

module.exports = router;