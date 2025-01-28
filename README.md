# sqlite3-example

This is a sample project for the accompanying Intro to SQL/sqlite3 presentation for OUSDC.

The provided instructions are intended for Linux-based operating systems (tested on Fedora and [WSL](https://learn.microsoft.com/en-us/windows/wsl/about)).

## Prerequisites

- Node.js >=18.12
- NPM

## Setup

0. Clone this repo
1. Install [pnpm](https://pnpm.io/) + project dependencies
    ```bash
    sudo npm i -g pnpm # Monorepo package manager
    pnpm install
    ```
2. Start the frontend + backend
    ```bash
    pnpm dev
    ```
3. Visit [http://localhost:3000](http://localhost:3000)

## Implement Example
You’ve just been hired as the backend developer for a sketchy productivity app startup. Fortunately, the frontend team has already created the interface for the app. But your app needs a database to store all the tasks! Using your newly acquired SQL knowledge you need to implement basic [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) functionality for the apps backend API.

0. Navigate to [/packages/backend/src/app.js](/packages/backend/src/app.js)
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

## Troubleshooting

1. **I don't have node.js installed**

**Answer:**  
You can install Node.js using the following command:
```bash
sudo apt install -y nodejs
```

2. **I don't have npm installed**

**Answer:**  
You can install npm using the following command:
```bash
sudo apt install -y npm
```

3. **After running `pnpm dev` I get a `EADDRINUSE: address already in use :::5000` error**

**Answer:**  
This may happen if `pnpm dev` is running in multiple consoles or if you change VSCode workspaces without closing the active terminal. Try looking for and closing out of all active terminals and try again. If that doesn't work, you can kill the process running on port 5000 using the following commands.
```bash
lsof -i tcp:5000
# Find the PID of the process and replace it below
kill PID
```
If for any other reason you can't use port 5000, you can change it to any other arbitrary port (preferably greater than 5000) in [/packages/backend/src/server.js](/packages/backend/src/server.js)

4. **My Node.js version is too old to install pnpm**

**Answer:**
Unfortanetly the Node.js version installed from `sudo apt install nodejs` is really old, you can update it with another npm package.
```bash
sudo npm i -g n
sudo n stable
```
