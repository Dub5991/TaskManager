import type { Task } from '../types';

let tasks: Task[] = [
  {
    id: '1',
    title: 'Sample Task 1',
    description: 'This is a sample task.',
    completed: false,
    userId: 'demo',
    createdAt: new Date().toISOString(),
    category: 'Work',
    labels: ['Urgent'],
    subtasks: [],
    comments: [],
  },
  {
    id: '2',
    title: 'Sample Task 2',
    description: 'This is another sample task.',
    completed: true,
    userId: 'demo',
    createdAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    category: 'Personal',
    labels: ['Low'],
    subtasks: [],
    comments: [],
  },
];

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const fetchTasks = async (): Promise<Task[]> => {
  await delay(200);
  return [...tasks];
};

export const fetchTaskById = async (taskId: string): Promise<Task> => {
  await delay(200);
  const task = tasks.find(t => t.id === taskId);
  if (!task) throw new Error('Task not found');
  return { ...task };
};

export const createTask = async (task: Task): Promise<Task> => {
  await delay(200);
  const newTask = {
    ...task,
    id: (Date.now() + Math.random()).toString(),
    createdAt: new Date().toISOString(),
    completed: false,
    completedAt: undefined,
  };
  tasks.push(newTask);
  return { ...newTask };
};

export const updateTask = async (task: Task): Promise<Task> => {
  await delay(200);
  const idx = tasks.findIndex(t => t.id === task.id);
  if (idx === -1) throw new Error('Task not found');
  // Only allow marking as complete, not toggling back
  if (!tasks[idx].completed && task.completed) {
    tasks[idx] = { ...task, completed: true, completedAt: new Date().toISOString() };
  } else {
    tasks[idx] = { ...task, completed: tasks[idx].completed, completedAt: tasks[idx].completedAt };
  }
  return { ...tasks[idx] };
};

export const deleteTask = async (taskId: string): Promise<void> => {
  await delay(200);
  tasks = tasks.filter(t => t.id !== taskId);
};