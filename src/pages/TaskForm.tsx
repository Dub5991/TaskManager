import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Form,
  Button,
  Alert,
  Row,
  Col,
  Badge,
  Card,
  Spinner,
  InputGroup,
} from 'react-bootstrap';
import { motion } from 'framer-motion';
import RecurringTaskControls from '../components/RecurringTaskControls';
import TaskAttachments from '../components/TaskAttachments';
import VoiceInput from '../components/VoiceInput';
import SubtaskList from '../components/SubtaskList';
import TaskComments from '../components/TaskComments';
import type { Task } from '../types';

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const initialForm: Partial<Task> = {
  title: '',
  description: '',
  category: '',
  dueDate: '',
  labels: [],
  subtasks: [],
  comments: [],
};

const TaskForm: React.FC = () => {
  const { tasks, add, update, loading, error } = useTaskContext();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const editing = Boolean(id);

  // Use refs to avoid stale closures in async
  const formRef = useRef<Partial<Task>>(initialForm);

  const [form, setForm] = useState<Partial<Task>>(initialForm);
  const [recurring, setRecurring] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [labelInput, setLabelInput] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  // Load task for editing
  useEffect(() => {
    if (editing) {
      const task = tasks.find(t => t.id === id);
      if (task) {
        setForm(task);
        formRef.current = task;
        setRecurring((task as any).recurring || '');
        setFiles((task.attachments as File[]) || []);
      }
    } else {
      setForm(initialForm);
      formRef.current = initialForm;
      setRecurring('');
      setFiles([]);
    }
  }, [editing, id, tasks]);

  // Keep formRef in sync
  useEffect(() => {
    formRef.current = form;
  }, [form]);

  // Handlers
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setForm(prev => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleVoice = useCallback(
    (text: string) => setForm(f => ({ ...f, description: (f.description || '') + ' ' + text })),
    []
  );

  const handleLabelAdd = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && labelInput.trim()) {
        e.preventDefault();
        setForm(f => ({
          ...f,
          labels: [...(f.labels || []), labelInput.trim()],
        }));
        setLabelInput('');
      }
    },
    [labelInput]
  );

  const handleLabelRemove = useCallback((idx: number) => {
    setForm(f => ({
      ...f,
      labels: (f.labels || []).filter((_, i) => i !== idx),
    }));
  }, []);

  const handleSubtaskToggle = useCallback((subtaskId: string) => {
    setForm(f => ({
      ...f,
      subtasks: (f.subtasks || []).map(st =>
        st.id === subtaskId ? { ...st, completed: !st.completed } : st
      ),
    }));
  }, []);

  const handleSubtaskAdd = useCallback((title: string) => {
    setForm(f => ({
      ...f,
      subtasks: [
        ...(f.subtasks || []),
        { id: Date.now().toString(), title, completed: false },
      ],
    }));
  }, []);

  const handleCommentAdd = useCallback((text: string) => {
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
  }, []);

  // Optimized submit handler
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLocalError(null);

      const { title, description } = formRef.current;
      if (!title || !description) {
        setLocalError('Title and Description are required.');
        return;
      }

      // Only include recurring if your Task type supports it
      const taskData: Task = {
        ...(formRef.current as Task),
        attachments: files,
        userId: 'demo',
        ...(recurring ? { recurring } : {}),
      };

      try {
        if (editing) {
          await update(taskData);
        } else {
          await add(taskData);
        }
        // Refetch tasks or update context if needed
        navigate('/');
      } catch (err: any) {
        setLocalError(err?.message || 'Failed to save task.');
      }
    },
    [add, update, editing, files, recurring, navigate]
  );

  // Dynamic update after clicking Update Task
  useEffect(() => {
    if (!editing) return;
    const task = tasks.find(t => t.id === id);
    if (task) {
      setForm(task);
      formRef.current = task;
      setRecurring((task as any).recurring || '');
      setFiles((task.attachments as File[]) || []);
    }
    // eslint-disable-next-line
  }, [tasks, editing, id]);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '100vh', background: '#f8fafc' }}
    >
      <Card
        className="shadow-lg"
        style={{
          width: '100%',
          maxWidth: 700,
          borderRadius: 18,
          border: 'none',
          background: 'white',
        }}
      >
        <Card.Body>
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-4 fw-bold text-primary">
              {editing ? 'Edit Task' : 'Add Task'}
            </h2>
          </motion.div>
          {(error || localError) && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Alert variant="danger">{error || localError}</Alert>
            </motion.div>
          )}
          <Form onSubmit={handleSubmit} autoComplete="off">
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Title</Form.Label>
                  <Form.Control
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    size="lg"
                    autoFocus
                    placeholder="Task title"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Category</Form.Label>
                  <Form.Control
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    size="lg"
                    placeholder="Category"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mt-3">
              <Form.Label className="fw-semibold">Description</Form.Label>
              <InputGroup>
                <Form.Control
                  as="textarea"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="Describe your task..."
                  style={{ resize: 'vertical' }}
                />
                <InputGroup.Text style={{ background: 'transparent', border: 'none' }}>
                  <VoiceInput onResult={handleVoice} />
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>
            <Row className="g-3 mt-1">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Due Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="dueDate"
                    value={form.dueDate?.slice(0, 10) || ''}
                    onChange={handleChange}
                    size="lg"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <RecurringTaskControls value={recurring} onChange={setRecurring} />
              </Col>
            </Row>
            <Form.Group className="mt-3">
              <Form.Label className="fw-semibold">Labels</Form.Label>
              <div className="d-flex flex-wrap align-items-center mb-2">
                {(form.labels || []).map((label, idx) => (
                  <motion.div
                    key={label + idx}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Badge
                      bg="info"
                      className="me-2 mb-1 px-3 py-2"
                      style={{ cursor: 'pointer', fontSize: 15 }}
                      onClick={() => handleLabelRemove(idx)}
                    >
                      {label} &times;
                    </Badge>
                  </motion.div>
                ))}
              </div>
              <Form.Control
                type="text"
                placeholder="Add label and press Enter"
                value={labelInput}
                onChange={e => setLabelInput(e.target.value)}
                onKeyDown={handleLabelAdd}
                size="lg"
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label className="fw-semibold">Subtasks</Form.Label>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <SubtaskList
                  subtasks={form.subtasks || []}
                  onToggle={handleSubtaskToggle}
                  onAdd={handleSubtaskAdd}
                />
              </motion.div>
            </Form.Group>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-3"
            >
              <TaskAttachments
                files={files}
                onAdd={file => setFiles(f => [...f, file])}
                onRemove={idx => setFiles(f => f.filter((_, i) => i !== idx))}
              />
            </motion.div>
            <Form.Group className="mt-3">
              <Form.Label className="fw-semibold">Comments</Form.Label>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <TaskComments
                  comments={form.comments || []}
                  onAdd={handleCommentAdd}
                />
              </motion.div>
            </Form.Group>
            <div className="d-flex justify-content-end mt-4">
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={loading}
                  className="px-5 py-2 fw-bold"
                  style={{ borderRadius: 12, letterSpacing: 1 }}
                >
                  {loading ? (
                    <>
                      <Spinner
                        animation="border"
                        size="sm"
                        className="me-2"
                        aria-hidden="true"
                      />
                      Saving...
                    </>
                  ) : editing ? (
                    'Update Task'
                  ) : (
                    'Add Task'
                  )}
                </Button>
              </motion.div>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </motion.div>
  );
};

export default TaskForm;