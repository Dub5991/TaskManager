import React, { useState, useEffect } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Alert, Row, Col, Badge } from 'react-bootstrap';
import RecurringTaskControls from '../components/RecurringTaskControls';
import TaskAttachments from '../components/TaskAttachments';
import VoiceInput from '../components/VoiceInput';
import SubtaskList from '../components/SubtaskList';
import TaskComments from '../components/TaskComments';
import type { Task, Subtask, Comment } from '../types';

const TaskForm: React.FC = () => {
  const { tasks, add, update, loading, error } = useTaskContext();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const editing = Boolean(id);
  const [form, setForm] = useState<Partial<Task>>({
    title: '',
    description: '',
    category: '',
    dueDate: '',
    labels: [],
    subtasks: [],
    comments: [],
  });
  const [recurring, setRecurring] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [labelInput, setLabelInput] = useState('');

  useEffect(() => {
    if (editing) {
      const task = tasks.find(t => t.id === id);
      if (task) setForm(task);
    }
  }, [editing, id, tasks]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleVoice = (text: string) =>
    setForm(f => ({ ...f, description: (f.description || '') + ' ' + text }));

  const handleLabelAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && labelInput.trim()) {
      e.preventDefault();
      setForm(f => ({
        ...f,
        labels: [...(f.labels || []), labelInput.trim()],
      }));
      setLabelInput('');
    }
  };

  const handleLabelRemove = (idx: number) => {
    setForm(f => ({
      ...f,
      labels: (f.labels || []).filter((_, i) => i !== idx),
    }));
  };

  const handleSubtaskToggle = (subtaskId: string) => {
    setForm(f => ({
      ...f,
      subtasks: (f.subtasks || []).map(st =>
        st.id === subtaskId ? { ...st, completed: !st.completed } : st
      ),
    }));
  };

  const handleSubtaskAdd = (title: string) => {
    setForm(f => ({
      ...f,
      subtasks: [
        ...(f.subtasks || []),
        { id: Date.now().toString(), title, completed: false },
      ],
    }));
  };

  const handleCommentAdd = (text: string) => {
    setForm(f => ({
      ...f,
      comments: [
        ...(f.comments || []),
        {
          id: Date.now().toString(),
          userId: 'demo',
          text,
          createdAt: new Date().toISOString(),
        },
      ],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description) return;
    const taskData: Task = {
      ...(form as Task),
      recurring,
      attachments: files,
      userId: 'demo',
    };
    if (editing) {
      await update(taskData);
    } else {
      await add(taskData);
    }
    navigate('/');
  };

  return (
    <div>
      <h2>{editing ? 'Edit Task' : 'Add Task'}</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                name="title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                name="category"
                value={form.category}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
          />
          <VoiceInput onResult={handleVoice} />
        </Form.Group>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="date"
                name="dueDate"
                value={form.dueDate?.slice(0, 10) || ''}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <RecurringTaskControls value={recurring} onChange={setRecurring} />
          </Col>
        </Row>
        <Form.Group className="mb-3">
          <Form.Label>Labels</Form.Label>
          <div className="d-flex flex-wrap align-items-center mb-2">
            {(form.labels || []).map((label, idx) => (
              <Badge
                key={label + idx}
                bg="info"
                className="me-2 mb-1"
                style={{ cursor: 'pointer' }}
                onClick={() => handleLabelRemove(idx)}
              >
                {label} &times;
              </Badge>
            ))}
          </div>
          <Form.Control
            type="text"
            placeholder="Add label and press Enter"
            value={labelInput}
            onChange={e => setLabelInput(e.target.value)}
            onKeyDown={handleLabelAdd}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Subtasks</Form.Label>
          <SubtaskList
            subtasks={form.subtasks || []}
            onToggle={handleSubtaskToggle}
            onAdd={handleSubtaskAdd}
          />
        </Form.Group>
        <TaskAttachments
          files={files}
          onAdd={file => setFiles(f => [...f, file])}
          onRemove={idx => setFiles(f => f.filter((_, i) => i !== idx))}
        />
        <Form.Group className="mb-3">
          <Form.Label>Comments</Form.Label>
          <TaskComments
            comments={form.comments || []}
            onAdd={handleCommentAdd}
          />
        </Form.Group>
        <Button type="submit" variant="primary" disabled={loading}>
          {editing ? 'Update' : 'Add'} Task
        </Button>
      </Form>
    </div>
  );
};

export default TaskForm;