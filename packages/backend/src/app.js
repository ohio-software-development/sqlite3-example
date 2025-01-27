const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// Allow CORS for localhost:3000 (frontend)
const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type'],
};
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '10kb' }));

// If 'database.db' does not exist, it will be created for us
const db = new sqlite3.Database('database.db');

// Your code here

// Routes
/**
 * GET /api/tasks
 * Returns a list of all tasks
 */
app.get('/api/tasks', async (req, res) => {

    // Your code here
    
});

/**
 * POST /api/tasks
 * Creates a task with the provided description
 */
app.post('/api/tasks', async (req, res) => {
    const { taskDescription } = req.body;

    // Your code here

});

/**
 * PATCH /api/tasks
 * Update a task's state (ie. marking as finished)
 */
app.patch('/api/tasks', async (req, res) => {
    const { taskId, finished } = req.body;

    // Your code here

});

/**
 * DELETE /api/tasks
 * Deletes a task by its id
 */
app.delete('/api/tasks/:id', async (req, res) => {
    const taskId = req.params.id;

    // Your code here

});

/** 
 * Serve custom 404
 * All requests that start with '/api' that are not handled
 * above will be caught here and sent the 404 message
 */
app.use('/api', (req, res) => {
    res.status(404).json({
        code: 404,
        status: 'error',
        data: {
            messsage: 'Unknown endpoint'
        }
    });
});

module.exports = app;