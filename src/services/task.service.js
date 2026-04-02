const prisma = require('../config/database');

async function createTask(data) {
    return await prisma.task.create({
        data: {
            title: data.title,
            description: data.description,
            priority: data.priority,
        },
    });
}

async function getAllTasks(filters = {}) {
    const where = {};

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

async function getTaskById(id) {
    return await prisma.task.findUnique({
        where: { id },
    });
}

async function updateTask(id, data) {
    return await prisma.task.update({
        where: { id },
        data,
    });
}

async function deleteTask(id) {
    return await prisma.task.delete({
        where: { id },
    });
}

module.exports = { createTask, getAllTasks, getTaskById, updateTask, deleteTask };