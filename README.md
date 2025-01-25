# sqlite3-example

This is a sample project for the accompanying Intro to SQL/sqlite3 presentation for OUSDC.

The provided instructions are intended for Linux-based operating systems (tested on Fedora and [WSL](https://learn.microsoft.com/en-us/windows/wsl/about)).

## Prerequisites

- Node.js
- NPM (comes with Node.js)

## Setup

0. Clone this repo
1. Install [pnpm](https://pnpm.io/) + project dependencies
    ```bash
    npm i -g pnpm # Monorepo package manager
    pnpm install
    ```
2. Start the frontend + backend
    ```bash
    pnpm dev
    ```
3. Visit [http://localhost:3000](http://localhost:3000)

## Implement Example
You’ve just been hired as the backend developer for a sketchy productivity app startup. Fortunately, the frontend team has already created the interface for the app. But your app needs a database to store all the tasks! Using your newly acquired SQL knowledge you need to implement basic [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) functionality for the apps backend API.

1. Create the database 'tasks' table
```js
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
```

2. Read and return a list of stored tasks
```js
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
```

3. Create a new task and add it to the 'tasks' table
```js
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
```

4. Update individual task completion statuses
```js
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
```

5. Delete a task by its ID
```js
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
```

Nice job! You've just transformed a sketchy startup's pipe dream into a fully functioning app. Your SQLite3-powered database is now handling task creation, retrieval, updates, and deletions! Unfortunately due to budget cuts the boss had to lay off half the team, including you. But with your new SQL skills you'll land a new startup gig in no time!