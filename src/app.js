const express = require('express');
const taskRoutes = require('./routes/task.routes');
const errorHandler = require('./middleware/task.errorHandler');

const app = express();

// Middleware: parse incoming JSON bodies
app.use(express.json());

// Health check route - always have this
app.get('/health', (req, res)=>{
    res.status(200).json({status:'ok', timeStamp: new Date().toISOString()});
})

// Routes
app.use('/api/tasks', taskRoutes);

// 404 handler - must be after all routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: `Routes ${req.method} ${req.path} not found`,
    });
});

// Error Handler - Must be last, Must have 4 parameters
app.use(errorHandler);

module.exports = app;