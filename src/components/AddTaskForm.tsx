import React, { useState } from 'react';
import type { Task } from '../types';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';

interface AddTaskFormProps {
  onAddTask: (task: Task) => void;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onAddTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && description.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        title,
        description,
        completed: false,
        userId: 'demo',
        createdAt: new Date().toISOString(),
        category,
        labels: [],
        subtasks: [],
        comments: [],
      };
      onAddTask(newTask);
      setTitle('');
      setDescription('');
      setCategory('');
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Row className="g-2 align-items-end">
        <Col xs={12} md={4}>
          <Form.Control
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </Col>
        <Col xs={12} md={4}>
          <Form.Control
            type="text"
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
          />
        </Col>
        <Col xs={12} md={3}>
          <Form.Control
            type="text"
            placeholder="Category"
            value={category}
            onChange={e => setCategory(e.target.value)}
          />
        </Col>
        <Col xs={12} md={1}>
          <Button type="submit" variant="info" className="w-100">
            Add
          </Button>
        </Col>
      </Row>
    </motion.form>
  );
};

export default AddTaskForm;