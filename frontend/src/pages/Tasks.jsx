import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import './Tasks.css';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const limit = 5;

  const fetchTasks = async (currentPage) => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/tasks?limit=${limit}&offset=${currentPage * limit}`);
      setTasks(res.data);
    } catch (err) {
      console.error('Fetch tasks error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks(page);
  }, [page]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      await axios.post('http://localhost:5000/api/tasks', { title: newTaskTitle });
      setNewTaskTitle('');
      fetchTasks(page); // Refresh list
    } catch (err) {
      console.error('Create task error', err);
    }
  };

  const toggleStatus = async (task) => {
    const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      await axios.patch(`http://localhost:5000/api/tasks/${task.id}/status`, { status: nextStatus });
      fetchTasks(page);
    } catch (err) {
      console.error('Update status error', err);
    }
  };

  return (
    <div className="tasks-container">
      <div className="tasks-header-row">
        <h1 className="page-title">Task Manager</h1>
      </div>

      <div className="task-creation glass-panel">
        <form onSubmit={handleCreateTask} className="task-form">
          <input 
            type="text" 
            className="input-field" 
            placeholder="What needs to be done?" 
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            <Plus size={18} /> Add Task
          </button>
        </form>
      </div>

      <div className="task-list glass-panel">
        {loading ? (
          <div className="loading-state">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="empty-state text-center">No tasks found. Create one above!</div>
        ) : (
          <ul className="tasks">
            {tasks.map(task => (
              <li key={task.id} className={`task-item ${task.status === 'completed' ? 'completed' : ''}`}>
                <div 
                  className={`task-checkbox ${task.status === 'completed' ? 'checked' : ''}`}
                  onClick={() => toggleStatus(task)}
                >
                  {task.status === 'completed' && <Check size={14} color="white" />}
                </div>
                <div className="task-content">
                  <p className="task-title">{task.title}</p>
                </div>
                <span className={`status-badge ${task.status.toLowerCase()}`}>
                  {task.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="pagination">
        <button 
          className="btn btn-secondary" 
          onClick={() => setPage(Math.max(0, page - 1))}
          disabled={page === 0}
        >
          <ChevronLeft size={16} /> Prev
        </button>
        <span className="page-indicator">Page {page + 1}</span>
        <button 
          className="btn btn-secondary" 
          onClick={() => setPage(page + 1)}
          disabled={tasks.length < limit}
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Tasks;
