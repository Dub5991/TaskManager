import React from 'react';
import type { Task } from '../types';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Form from 'react-bootstrap/Form';
import { motion } from 'framer-motion';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleComplete: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit, onDelete, onToggleComplete }) => (
  <motion.div
    className="d-flex justify-content-between align-items-center"
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    layout
  >
    <div className="d-flex align-items-center">
      <Form.Check
        type="checkbox"
        checked={task.completed}
        disabled={task.completed}
        onChange={() => {
          if (!task.completed) {
            onToggleComplete({ ...task, completed: true, completedAt: new Date().toISOString() });
          }
        }}
        className="me-3"
        aria-label="Mark as complete"
      />
      <div>
        <h5 className={`mb-1 ${task.completed ? 'text-decoration-line-through text-muted' : ''}`}>
          {task.title}{' '}
          {task.completed && <Badge bg="success">Completed</Badge>}
          {task.labels && task.labels.map(label => (
            <Badge key={label} bg="info" className="ms-2">{label}</Badge>
          ))}
        </h5>
        <div className="text-muted">{task.description}</div>
      </div>
    </div>
    <div>
      <Button
        variant="outline-primary"
        size="sm"
        className="me-2"
        onClick={() => onEdit(task)}
      >
        Edit
      </Button>
      <Button
        variant="outline-danger"
        size="sm"
        onClick={() => onDelete(task.id)}
      >
        Delete
      </Button>
    </div>
  </motion.div>
);

export default TaskItem;