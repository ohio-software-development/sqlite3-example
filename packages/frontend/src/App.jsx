import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const BASE_URL = 'http://localhost:5000';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [error, setError] = useState('');

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/tasks`);

      setTasks(response.data.data.tasks);
      setError('');
    } catch (err) {
      setError('Error fetching tasks from the server.');
      if (err.status == 404) {
        setError(`Error fetching tasks from the server.\nIs the GET /api/tasks route implemented?`);
      }
    }
  };

  // Add a new task
  const addTask = async () => {
    if (!newTask.trim()) {
      setError('Task description cannot be empty.');
      return;
    }

    try {
      await axios.post(`${BASE_URL}/api/tasks`, {
        taskDescription: newTask,
      });

      fetchTasks();
      setNewTask('');
      setError('');
    } catch (err) {
      setError('Error adding task to the server.');
      if (err.status == 404) {
        setError(`Error adding task to the server.\nIs the POST /api/tasks route implemented?`);
      }
    }
  };

  // Update a task's finished status
  const toggleTaskStatus = async (id, finished) => {
    try {
      await axios.patch(`${BASE_URL}/api/tasks`, {
        taskId: id,
        finished: !finished
      });

      fetchTasks();
      setError('');
    } catch (err) {
      setError('Error updating task on the server.');
      if (err.status == 404) {
        setError(`Error updating task on the server.\nIs the PATCH /api/tasks route implemented?`);
      }
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/tasks/${id}`);

      fetchTasks();
      setError('');
    } catch (err) {
      setError('Error deleting task from the server.');
      if (err.status == 404) {
        setError(`Error deleting task from the server.\nIs the DELETE /api/tasks/:id route implemented?`);
      }
    }
  };

  // Fetch tasks when the page loads
  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="container">
      <h2>Task List</h2>
      {error && <p className="error">{error}</p>}
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            <span
              onClick={() => toggleTaskStatus(task.id, task.finished)}
              className={task.finished ? 'task-done' : ''}
            >
              {task.description}
            </span>
            <button onClick={() => deleteTask(task.id)} className="delete-button">
              Delete
            </button>
          </li>
        ))}
        <li className="task-item">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Enter task description"
            />
            <button onClick={addTask} className="add-button">Add Task</button>
        </li>
      </ul>
    </div>
  );
}

export default App;