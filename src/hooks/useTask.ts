import { useTaskContext } from '../context/TaskContext';

export const useTasks = () => {
  const ctx = useTaskContext();
  return ctx;
};