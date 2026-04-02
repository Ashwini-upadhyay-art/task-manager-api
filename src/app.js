const express = require('express');
const app = express();

// Middleware: parse incoming JSON bodies
app.use(express.json());

// Health check route - always have this
app.get('/health', (req, res)=>{
    res.status(200).json({status:'ok', timeStamp: new Date().toISOString()});
})

module.exports = app