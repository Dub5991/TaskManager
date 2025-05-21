import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Task } from '../types';
import * as api from '../api/tasks';

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchAll: () => Promise<void>;
  add: (task: Task) => Promise<void>;
  update: (task: Task) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      setTasks(await api.fetchTasks());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const add = async (task: Task) => {
    setLoading(true);
    setError(null);
    try {
      await api.createTask(task);
      await fetchAll();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const update = async (task: Task) => {
    setLoading(true);
    setError(null);
    try {
      await api.updateTask(task);
      await fetchAll();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.deleteTask(id);
      await fetchAll();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  return (
    <TaskContext.Provider value={{ tasks, loading, error, fetchAll, add, update, remove }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTaskContext must be used within TaskProvider');
  return ctx;
};