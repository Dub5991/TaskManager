import React from 'react';
import type { Task } from '../types';
import TaskItem from './TaskItem';
import ListGroup from 'react-bootstrap/ListGroup';
import { AnimatePresence, motion } from 'framer-motion';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onEdit, onDelete, onToggleComplete }) => (
  <ListGroup variant="flush">
    <AnimatePresence>
      {tasks.map(task => (
        <motion.div
          key={task.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          layout
        >
          <ListGroup.Item>
            <TaskItem
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleComplete={onToggleComplete}
            />
          </ListGroup.Item>
        </motion.div>
      ))}
    </AnimatePresence>
    {tasks.length === 0 && (
      <ListGroup.Item className="text-center text-muted">
        No tasks found.
      </ListGroup.Item>
    )}
  </ListGroup>
);

export default TaskList;