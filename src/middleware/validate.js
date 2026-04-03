const { Priority } = require('@prisma/client');
const { z } = require('zod');

// Define the shape fo a valid task
const createTaskSchema = z.object({
    title: z
        .string({error: 'Title is required'})
        .min(1, 'Title cannot be empty')
        .max(100, 'Title cannot exceed 100 characters')
        .trim(),
    
    description: z
        .string()
        .max(500, 'Description cannot exceed 500 characters')
        .trim()
        .optional(),

    priority: z
        .enum(['LOW', 'MEDIUM', 'HIGH'])
        .optional(),
}).strict();

const updateTaskSchema = z.object({
    title: z
    .string()
    .min(1, 'Title cannot be empty')
    .max(100, 'Title cannot exceed 100 characters')
    .trim()
    .optional(),

  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .trim()
    .optional(),

  priority: z
    .enum(['LOW', 'MEDIUM', 'HIGH'], {
      errorMap: () => ({ message: 'Priority must be LOW, MEDIUM, or HIGH' }),
    })
    .optional(),

  completed: z
    .boolean({ invalid_type_error: 'Completed must be a boolean' })
    .optional(),
}).strict();

function validateId(req, res, next){
    const id = Number(req.params.id);

    if(!Number.isInteger(id) || id <= 0){
        return res.status(400).json({
            success:false,
            error: 'Invalid ID - must be a positive integer',
        });
    }

    req.params.id = id;
    next();
}

// Middleware factory - takes a schema, returns a middleware function
function validate(schema){
    return(req, res, next) => {
        const result = schema.safeParse(req.body);

        if(!result.success){
            const errors = result.error.issues.map((issue) => ({
                field: issue.path.join('.') || 'body',
                message: issue.message,
            }));

            return res.status(400).json({
                success:false,
                error: 'Validation Failed',
                details: errors,
            });
        }

        // Replace req.body with the validated + sanitized data
        // This strips any unknown fields
        req.body = result.data;
        next();
    };
}

module.exports = { validate, validateId, createTaskSchema, updateTaskSchema };