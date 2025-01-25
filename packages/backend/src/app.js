const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json({ limit: '10kb' }));

// If 'database.db' does not exist, it will be created for us
const db = new sqlite3.Database('database.db');

// Task table statement
const createTaskTable = `
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT NOT NULL,
        finished BOOLEAN NOT NULL DEFAULT 0
    )
`;

// Create table if it doesn't exist
db.run(createTaskTable, function (err) {
    if (err) {
        return console.error('Error creating table:', err.message);
    }
    console.log('Table created successfully');
});

// Routes
/**
 * GET /api/tasks
 * Returns a list of all tasks
 */
app.get('/api/tasks', async (req, res) => {
    const query = `SELECT id, description, finished FROM tasks`;

    db.all(query, function (error, tasks) {
        if (error) {
            console.error(error);
            return res.status(500).json({
                code: 500,
                status: 'error',
                data: {
                    messsage: 'An internal error occurred retrieving tasks',
                }
            });
        }
        return res.status(200).json({
            code: 200,
            status: 'success',
            data: {
                messsage: 'Tasks successfully retrieved',
                tasks
            }
        });
    });
});

/**
 * POST /api/tasks
 * Creates a task with the provided description
 */
app.post('/api/tasks', async (req, res) => {
    const { taskDescription } = req.body;

    const query = `INSERT INTO tasks (description) VALUES (?)`;

    db.run(query, [taskDescription], function (error) {
        if (error) {
            console.error(error);
            return res.status(500).json({
                code: 500,
                status: 'error',
                data: {
                    messsage: 'An internal error occurred adding task',
                }
            });
        }
        return res.status(200).json({
            code: 200,
            status: 'success',
            data: {
                messsage: 'Task successfully added',
            }
        });
    });
});

/**
 * PATCH /api/tasks
 * Update a task's state (ie. marking as finished)
 */
app.patch('/api/tasks', async (req, res) => {
    const { taskId, finished } = req.body;

    const query = `UPDATE tasks SET finished = ? WHERE id = ?`;

    db.run(query, [finished, taskId], function (error) {
        if (error) {
            console.error(error);
            return res.status(500).json({
                code: 500,
                status: 'error',
                data: {
                    messsage: 'An internal error occurred updating task',
                }
            });
        }
        return res.status(200).json({
            code: 200,
            status: 'success',
            data: {
                messsage: 'Tasks successfully updated',
            }
        });
    });
});

/**
 * DELETE /api/tasks
 * Deletes a task by its id
 */
app.delete('/api/tasks/:id', async (req, res) => {
    const taskId = req.params.id;

    const query = `DELETE FROM tasks WHERE id = ?`;

    db.run(query, [taskId], function (error) {
        if (error) {
            console.error(error);
            return res.status(500).json({
                code: 500,
                status: 'error',
                data: {
                    messsage: 'An internal error occurred deleting task',
                }
            });
        }
        return res.status(200).json({
            code: 200,
            status: 'success',
            data: {
                messsage: 'Task successfully deleted',
            }
        });
    });
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