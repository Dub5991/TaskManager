import React, { useState, useMemo } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { useNavigate } from 'react-router-dom';
import TaskList from '../components/TaskList';
import CategoryFilter from '../components/CategoryFilter';
import AnalyticsCharts from '../components/AnalyticsCharts';
import AddTaskForm from '../components/AddTaskForm';
import DashboardCustomizer from '../components/DashBoardCustomizer';
import PomodoroTimer from '../components/PromodoroTimer';
import MilestoneProgress from '../components/MilestoneProgress';
import GamificationPanel from '../components/GamificationPanel';
import SmartSearch from '../components/SmartSearch';
import NotificationBell from '../components/NotificationBell';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';
import {
  Container,
  Grid,
  Paper,
  Stack,
  Title,
  Text,
  Group,
  ThemeIcon,
  rem,
  Badge,
  Tooltip,
  ActionIcon,
  Avatar,
} from '@mantine/core';
import { IconTarget, IconTrophy, IconBell, IconSettings, IconPlus } from '@tabler/icons-react';

// Sleek, modern color palette
const luxuryColors = {
  background: 'linear-gradient(120deg, #18181b 0%, #232946 100%)',
  card: 'rgba(34, 40, 49, 0.96)',
  accent: '#FFD700',
  accentSoft: '#f5e9c8',
  text: '#f4f4f4',
  secondaryText: '#b4b8c5',
  border: 'rgba(255, 215, 0, 0.18)',
  glass: 'rgba(255,255,255,0.10)',
};

const defaultWidgets = {
  analytics: true,
  pomodoro: true,
  milestones: true,
  showCustomizer: false,
};

const Dashboard: React.FC = () => {
  const { tasks, add, remove, update, loading, error } = useTaskContext();
  const [category, setCategory] = useState('');
  const [widgets, setWidgets] = useState(defaultWidgets);
  const [search, setSearch] = useState('');
  const [notifications, setNotifications] = useState<string[]>([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const navigate = useNavigate();

  const categories = useMemo(
    () => Array.from(new Set(tasks.map(t => t.category).filter(Boolean) as string[])),
    [tasks]
  );

  const filteredTasks = useMemo(() => {
    let filtered = category ? tasks.filter(t => t.category === category) : tasks;
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        t =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          (t.labels && t.labels.some(l => l.toLowerCase().includes(q))) ||
          (t.category && t.category.toLowerCase().includes(q))
      );
    }
    return filtered;
  }, [tasks, category, search]);

  const handleEdit = (task: { id: string }) => navigate(`/edit/${task.id}`);
  const handleDelete = (id: string) => {
    remove(id);
    toast.info('Task deleted!');
  };
  const handleToggleComplete = (task: { id: string; completed: boolean }) => {
    const fullTask = tasks.find(t => t.id === task.id);
    if (fullTask) {
      update({ ...fullTask, completed: task.completed });
      toast.success(task.completed ? 'Task marked complete!' : 'Task marked incomplete!');
    }
  };

  // Example milestones and gamification data
  const milestones = [
    { id: 'm1', title: 'First 5 Tasks', completed: tasks.length >= 5 },
    { id: 'm2', title: 'First Completed Task', completed: tasks.some(t => t.completed) },
  ];
  const streak = 3;
  const achievements = ['Starter', 'First Streak'];
  const points = 120;

  // Notification bell logic
  const handleBellClick = () => {
    setNotifications([]);
    toast('You have checked your notifications!');
  };

  // Responsive: collapse analytics/gamification on mobile
  const isMobile = window.innerWidth < 992;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      style={{
        minHeight: '100vh',
        background: luxuryColors.background,
        fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
      }}
    >
      {/* Sticky Header */}
      <Paper
        shadow="lg"
        radius={0}
        p="md"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(24,24,27,0.95)',
          borderBottom: `1.5px solid ${luxuryColors.border}`,
          backdropFilter: 'blur(8px)',
        }}
      >
        <Group justify="space-between" align="center">
          <Group gap="xs">
            <ThemeIcon size="xl" radius="xl" color="yellow" variant="gradient" gradient={{ from: 'yellow', to: 'orange', deg: 90 }}>
              <IconTarget size={28} />
            </ThemeIcon>
            <Title order={2} style={{ color: luxuryColors.accent, fontWeight: 900, letterSpacing: 1 }}>
              Extreme Goal Setter
            </Title>
            <Badge color="yellow" variant="light" size="lg" ml="sm" style={{ letterSpacing: 0.5 }}>
              Beta
            </Badge>
          </Group>
          <Group gap="xs">
            <Tooltip label="Notifications" withArrow>
              <NotificationBell count={notifications.length} onClick={handleBellClick} />
            </Tooltip>
            <Tooltip label="Customize Dashboard" withArrow>
              <ActionIcon
                variant="light"
                color="yellow"
                size="lg"
                radius="xl"
                onClick={() => setWidgets(w => ({ ...w, showCustomizer: !w.showCustomizer }))}
              >
                <IconSettings size={22} />
              </ActionIcon>
            </Tooltip>
            <Avatar radius="xl" size="md" src={undefined} color="yellow">
              U
            </Avatar>
          </Group>
        </Group>
      </Paper>
      <Container size="xl" px="md" pt="lg">
        <Text c={luxuryColors.secondaryText} mb="lg" size="lg" style={{ textAlign: 'center', fontWeight: 500 }}>
          Plan. Execute. Achieve.{' '}
          <span style={{ color: luxuryColors.accentSoft, fontWeight: 700 }}>Level up your productivity.</span>
        </Text>
        <Grid gutter="xl" align="stretch">
          {/* Main Task Area */}
          <Grid.Col span={{ base: 12, md: 7, lg: 6 }}>
            <Paper
              shadow="xl"
              radius="xl"
              p="xl"
              style={{
                background: luxuryColors.card,
                border: `2px solid ${luxuryColors.border}`,
                minHeight: rem(500),
                position: 'relative',
                overflow: 'visible',
              }}
            >
              <Stack gap="md">
                <Group justify="space-between" align="center" mb="xs">
                  <CategoryFilter
                    categories={categories}
                    selected={category}
                    onSelect={setCategory}
                  />
                  <SmartSearch onSearch={setSearch} />
                </Group>
                <AnimatePresence>
                  {showAddTask && (
                    <motion.div
                      key="add-task"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.4 }}
                    >
                      <AddTaskForm
                        onAddTask={task => {
                          add(task);
                          setShowAddTask(false);
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                {loading && <Text c={luxuryColors.accent}>Loading tasks...</Text>}
                {error && <Text c="red">{error}</Text>}
                <TaskList
                  tasks={filteredTasks}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleComplete={handleToggleComplete}
                />
              </Stack>
              {/* Floating Add Task Button */}
              <Tooltip label="Add Task" withArrow>
                <ActionIcon
                  size={56}
                  radius="xl"
                  color="yellow"
                  variant="filled"
                  style={{
                    position: 'absolute',
                    bottom: rem(24),
                    right: rem(24),
                    boxShadow: '0 4px 24px 0 rgba(255,215,0,0.18)',
                    zIndex: 10,
                  }}
                  onClick={() => setShowAddTask(true)}
                >
                  <IconPlus size={32} />
                </ActionIcon>
              </Tooltip>
            </Paper>
          </Grid.Col>
          {/* Analytics & Pomodoro */}
          {!isMobile && (
            <Grid.Col span={{ base: 12, md: 5, lg: 3 }}>
              <Stack gap="lg">
                {widgets.analytics && (
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <Paper
                      shadow="md"
                      radius="xl"
                      p="lg"
                      style={{
                        background: luxuryColors.glass,
                        border: `1.5px solid ${luxuryColors.border}`,
                      }}
                    >
                      <Group gap="xs" mb="xs">
                        <ThemeIcon color="yellow" variant="light" size="lg" radius="xl">
                          <IconTrophy size={22} />
                        </ThemeIcon>
                        <Text fw={700} c={luxuryColors.accent}>Analytics</Text>
                      </Group>
                      <AnalyticsCharts tasks={tasks} />
                    </Paper>
                  </motion.div>
                )}
                {widgets.pomodoro && (
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Paper
                      shadow="md"
                      radius="xl"
                      p="lg"
                      style={{
                        background: luxuryColors.glass,
                        border: `1.5px solid ${luxuryColors.border}`,
                      }}
                    >
                      <Group gap="xs" mb="xs">
                        <ThemeIcon color="red" variant="light" size="lg" radius="xl">
                          <IconBell size={22} />
                        </ThemeIcon>
                        <Text fw={700} c={luxuryColors.accent}>Pomodoro Timer</Text>
                      </Group>
                      <PomodoroTimer />
                    </Paper>
                  </motion.div>
                )}
              </Stack>
            </Grid.Col>
          )}
          {/* Milestones & Gamification */}
          {!isMobile && (
            <Grid.Col span={{ base: 12, lg: 3 }}>
              <Stack gap="lg">
                {widgets.milestones && (
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <Paper
                      shadow="md"
                      radius="xl"
                      p="lg"
                      style={{
                        background: luxuryColors.glass,
                        border: `1.5px solid ${luxuryColors.border}`,
                      }}
                    >
                      <Group gap="xs" mb="xs">
                        <ThemeIcon color="blue" variant="light" size="lg" radius="xl">
                          <IconTrophy size={22} />
                        </ThemeIcon>
                        <Text fw={700} c={luxuryColors.accent}>Milestones</Text>
                      </Group>
                      <MilestoneProgress milestones={milestones} />
                    </Paper>
                  </motion.div>
                )}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Paper
                    shadow="md"
                    radius="xl"
                    p="lg"
                    style={{
                      background: luxuryColors.glass,
                      border: `1.5px solid ${luxuryColors.border}`,
                    }}
                  >
                    <GamificationPanel streak={streak} achievements={achievements} points={points} />
                  </Paper>
                </motion.div>
              </Stack>
            </Grid.Col>
          )}
        </Grid>
      </Container>
      {/* Dashboard Customizer Modal/Drawer */}
      <AnimatePresence>
        {widgets.showCustomizer && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.4 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0,0,0,0.25)',
              zIndex: 2000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={() => setWidgets(w => ({ ...w, showCustomizer: false }))}
          >
            <motion.div
              initial={{ scale: 0.96 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.96 }}
              transition={{ duration: 0.3 }}
              style={{
                background: '#fff',
                borderRadius: 24,
                boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                padding: 32,
                minWidth: 340,
                maxWidth: 540,
                width: '90vw',
              }}
              onClick={e => e.stopPropagation()}
            >
              <DashboardCustomizer
                visible={widgets}
                onChange={(key: string, show: boolean) => setWidgets((w: typeof widgets) => ({ ...w, [key]: show }))}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Dashboard;