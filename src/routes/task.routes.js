const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const { validate, createTaskSchema, updateTaskSchema } = require('../middleware/validate');

router.post('/', validate(createTaskSchema), taskController.createTask);
router.get('/', taskController.getAllTask);
router.get('/:id', taskController.getTaskById);
router.patch('/:id', validate(updateTaskSchema), taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;