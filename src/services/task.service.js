const prisma = require('../config/database');

async function createTask(data, userId) {
    return await prisma.task.create({
        data: {
            title: data.title,
            description: data.description,
            priority: data.priority,
            userId,
        },
    });
}

async function getAllTasks(filters = {}, userId) {
    const where = { userId };

    if (filters.completed != undefined) {
        where.completed = filters.completed === 'true';
    }

    if (filters.priority) {
        where.priority = filters.priority.toUpperCase();
    }

    return await prisma.task.findMany({
        where,
        orderBy: { createdAt: 'desc' },
    });
}

async function getTaskById(id, userId) {
    return await prisma.task.findUnique({
        where: { id, userId },
    });
}

async function updateTask(id, data, userId) {
    return await prisma.task.update({
        where: { id, userId },
        data,
    });
}

async function deleteTask(id, userId) {
    return await prisma.task.delete({
        where: { id, userId },
    });
}

module.exports = { createTask, getAllTasks, getTaskById, updateTask, deleteTask };