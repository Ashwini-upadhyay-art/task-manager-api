const TaskService = require('../services/task.service');

async function createTask(req, res, next){
    try{
        const task = await TaskService.createTask(req.body, req.user.userId);
        res.status(201).json({
            success: true,
            data: task,
        });
    } catch (error) {
        next(error);
    }
}

async function getAllTask(req, res, next) {
    try {
        const tasks = await TaskService.getAllTasks(req.query, req.user.userId);
        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks,
        });
    } catch (error){
        next(error);
    }
}

async function getTaskById(req, res, next) {
    try{
        const task = await TaskService.getTaskById(Number(req.params.id), req.user.userId);

        if(!task){
            res.status(404).json({
                success: false,
                error: 'Task not found.',
            });
        }

        res.status(200).json({
            success: true,
            data: task,
        });
    } catch (error) {
        next(error);
    }
}

async function updateTask(req, res, next){
    try{
        const task = await TaskService.getTaskById(Number(req.params.id), req.user.userId);
        
        if(!task){
            res.status(404).json({
                success: false, 
                error: 'Task not found',
            });
        }
        
        const updated = await TaskService.updateTask(Number(req.params.id), req.body, req.user.userId);

        res.status(200).json({
            success: true,
            data: updated,
        });
    } catch(error){
        next(error);
    }
}

async function deleteTask(req, res, next){
    try{
        const task = await TaskService.getTaskById(Number(req.params.id), req.user.userId);
        
        if(!task){
            res.status(404).json({
                success: false,
                error: 'Task not found.',
            });
        }

        await TaskService.deleteTask(Number(req.params.id), req.user.userId);

        res.status(204).send();
    } catch(error){
        next(error);
    }
}

module.exports = {
    createTask,
    getAllTask,
    getTaskById,
    updateTask,
    deleteTask,
};