import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import type { Task } from '../types';
import { fetchTaskById } from '../api/tasks';

const TaskDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchTaskById(id)
        .then(setTask)
        .catch((err: unknown) => {
          if (err instanceof Error) setError(err.message);
          else setError('An unknown error occurred.');
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!task) return <div>Task not found.</div>;

  return (
    <div>
      <div className="page-title">Task Details</div>
      <h2>{task.title}</h2>
      <p>{task.description}</p>
      <p>Status: {task.completed ? 'Completed' : 'Incomplete'}</p>
      <p>Category: {task.category || 'None'}</p>
      <p>Due Date: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'None'}</p>
      <button onClick={() => navigate(`/edit/${task.id}`)}>Edit</button>
      <Link to="/">Back</Link>
    </div>
  );
};

export default TaskDetails;