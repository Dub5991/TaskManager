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
  Row,
  Col,
  Card,
  Stack,
  Badge,
  OverlayTrigger,
  Tooltip as BSTooltip,
  Button,
} from 'react-bootstrap';
import { IconTarget, IconTrophy, IconBell, IconSettings, IconPlus } from '@tabler/icons-react';

// Color palette
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

const WIDGETS_STORAGE_KEY = 'dashboardWidgets';

const defaultWidgets = {
  analytics: true,
  pomodoro: true,
  milestones: true,
  showCustomizer: false,
};

function loadWidgets() {
  try {
    const stored = localStorage.getItem(WIDGETS_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return defaultWidgets;
}

function saveWidgets(widgets: typeof defaultWidgets) {
  localStorage.setItem(WIDGETS_STORAGE_KEY, JSON.stringify(widgets));
}

// --- Achievements logic for dashboard milestone progress ---
function getStreak(tasks: any[], days: number) {
  const completed = tasks.filter(t => t.completed && t.completedAt).sort((a, b) =>
    a.completedAt > b.completedAt ? 1 : -1
  );
  let streak = 0;
  let lastDate: string | null = null;
  for (let i = completed.length - 1; i >= 0; i--) {
    const day = completed[i].completedAt.slice(0, 10);
    if (!lastDate) {
      lastDate = day;
      streak = 1;
    } else {
      const diff = Math.floor(
        (new Date(lastDate).getTime() - new Date(day).getTime()) / (1000 * 60 * 60 * 24)
      );
      if (diff === 1) {
        streak++;
        lastDate = day;
      } else if (diff === 0) {
        // same day, continue
      } else {
        break;
      }
    }
  }
  return streak >= days;
}

const achievementDefs = [
  {
    id: 1,
    title: 'First Task Completed',
    description: 'Complete your first task!',
    check: (tasks: any[]) => tasks.filter(t => t.completed).length >= 1,
  },
  {
    id: 2,
    title: 'Five Tasks Done',
    description: 'Complete five tasks.',
    check: (tasks: any[]) => tasks.filter(t => t.completed).length >= 5,
  },
  {
    id: 3,
    title: 'Streak Starter',
    description: 'Complete tasks 3 days in a row.',
    check: (tasks: any[]) => getStreak(tasks, 3),
  },
  {
    id: 4,
    title: 'Task Master',
    description: 'Complete 20 tasks.',
    check: (tasks: any[]) => tasks.filter(t => t.completed).length >= 20,
  },
  {
    id: 5,
    title: 'Consistency King',
    description: 'Complete at least one task every day for 7 days.',
    check: (tasks: any[]) => getStreak(tasks, 7),
  },
  {
    id: 6,
    title: 'Early Bird',
    description: 'Complete a task before 8 AM.',
    check: (tasks: any[]) =>
      tasks.some(
        t =>
          t.completed &&
          t.completedAt &&
          new Date(t.completedAt).getHours() < 8
      ),
  },
  {
    id: 7,
    title: 'Night Owl',
    description: 'Complete a task after 10 PM.',
    check: (tasks: any[]) =>
      tasks.some(
        t =>
          t.completed &&
          t.completedAt &&
          new Date(t.completedAt).getHours() >= 22
      ),
  },
  {
    id: 8,
    title: 'Quick Finisher',
    description: 'Complete a task within 10 minutes of creating it.',
    check: (tasks: any[]) =>
      tasks.some(
        t =>
          t.completed &&
          t.completedAt &&
          t.createdAt &&
          (new Date(t.completedAt).getTime() - new Date(t.createdAt).getTime()) / 60000 <= 10
      ),
  },
  {
    id: 9,
    title: 'Procrastinator',
    description: 'Complete a task more than 7 days after creating it.',
    check: (tasks: any[]) =>
      tasks.some(
        t =>
          t.completed &&
          t.completedAt &&
          t.createdAt &&
          (new Date(t.completedAt).getTime() - new Date(t.createdAt).getTime()) / (1000 * 60 * 60 * 24) >= 7
      ),
  },
  {
    id: 10,
    title: 'Collaborator',
    description: 'Create a task with at least 2 subtasks.',
    check: (tasks: any[]) =>
      tasks.some(t => Array.isArray(t.subtasks) && t.subtasks.length >= 2),
  },
  {
    id: 11,
    title: 'Commenter',
    description: 'Add a comment to a task.',
    check: (tasks: any[]) =>
      tasks.some(t => Array.isArray(t.comments) && t.comments.length > 0),
  },
  {
    id: 12,
    title: 'Attachment Pro',
    description: 'Add an attachment to a task.',
    check: (tasks: any[]) =>
      tasks.some(t => Array.isArray(t.attachments) && t.attachments.length > 0),
  },
  {
    id: 13,
    title: 'Recurring Hero',
    description: 'Create a recurring task.',
    check: (tasks: any[]) => tasks.some(t => t.recurring === true),
  },
  {
    id: 14,
    title: 'Label Lover',
    description: 'Create a task with at least 3 labels.',
    check: (tasks: any[]) =>
      tasks.some(t => Array.isArray(t.labels) && t.labels.length >= 3),
  },
  {
    id: 15,
    title: 'Category Organizer',
    description: 'Create tasks in 5 different categories.',
    check: (tasks: any[]) => {
      const cats = new Set(tasks.map(t => t.category).filter(Boolean));
      return cats.size >= 5;
    },
  },
];

const Dashboard: React.FC = () => {
  const { tasks, add, remove, update, loading, error } = useTaskContext();
  const [category, setCategory] = useState('');
  const [widgets, setWidgets] = useState(() => loadWidgets());
  const [search, setSearch] = useState('');
  const [notifications, setNotifications] = useState<string[]>([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [customizerSaving, setCustomizerSaving] = useState(false);
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

  // Achievements as milestones for MilestoneProgress
  const achievementMilestones = useMemo(
    () =>
      achievementDefs.map(a => ({
        id: String(a.id),
        title: a.title,
        completed: a.check(tasks),
        description: a.description,
      })),
    [tasks]
  );

  // Notification bell logic
  const handleBellClick = () => {
    setNotifications([]);
    toast('You have checked your notifications!');
  };

  // Save widgets to localStorage and close customizer
  const handleCustomizerSave = () => {
    setCustomizerSaving(true);
    setTimeout(() => {
      saveWidgets({ ...widgets, showCustomizer: false });
      setWidgets(w => ({ ...w, showCustomizer: false }));
      setCustomizerSaving(false);
      toast.success('Dashboard updated!');
    }, 400);
  };

  // Close customizer without saving
  const handleCustomizerClose = () => {
    setWidgets(loadWidgets());
    setWidgets(w => ({ ...w, showCustomizer: false }));
  };

  // --- Floating Card Layout for Dashboard Panels ---
  const panelVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.92 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

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
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(24,24,27,0.95)',
          borderBottom: `1.5px solid ${luxuryColors.border}`,
          backdropFilter: 'blur(8px)',
        }}
      >
        <Container fluid className="py-2">
          <Row className="align-items-center justify-content-between">
            <Col xs="auto" className="d-flex align-items-center gap-2">
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <IconTarget size={32} color="#FFD700" style={{ marginRight: 8 }} />
                <span style={{ color: luxuryColors.accent, fontWeight: 900, fontSize: 24, letterSpacing: 1 }}>
                  Extreme Goal Setter
                </span>
                <Badge bg="warning" text="dark" className="ms-2" style={{ fontWeight: 600, fontSize: 14 }}>
                  Beta
                </Badge>
              </span>
            </Col>
            <Col xs="auto" className="d-flex align-items-center gap-2">
              <OverlayTrigger placement="bottom" overlay={<BSTooltip>Notifications</BSTooltip>}>
                <span>
                  <NotificationBell count={notifications.length} onClick={handleBellClick} />
                </span>
              </OverlayTrigger>
              <OverlayTrigger placement="bottom" overlay={<BSTooltip>Customize Dashboard</BSTooltip>}>
                <Button
                  variant="outline-warning"
                  size="sm"
                  className="rounded-circle ms-2"
                  style={{ borderWidth: 2 }}
                  onClick={() => setWidgets(w => ({ ...w, showCustomizer: true }))}
                >
                  <IconSettings size={20} />
                </Button>
              </OverlayTrigger>
              <span
                className="rounded-circle bg-warning text-dark d-flex align-items-center justify-content-center ms-2"
                style={{ width: 38, height: 38, fontWeight: 700, fontSize: 18, border: '2px solid #FFD700' }}
              >
                U
              </span>
            </Col>
          </Row>
        </Container>
      </motion.div>
      <Container fluid className="py-4">
        <Row className="g-4 justify-content-center">
          <Col xs={12} lg={10} xl={9}>
            <Stack gap={4}>
              {/* Main Task Card */}
              <motion.div
                layout
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={panelVariants}
                transition={{ duration: 0.5, type: 'spring' }}
                style={{
                  borderRadius: 28,
                  boxShadow: '0 8px 32px 0 rgba(255,215,0,0.10), 0 2px 8px 0 #232946',
                  background: luxuryColors.card,
                  border: `2px solid ${luxuryColors.border}`,
                  minHeight: 520,
                  position: 'relative',
                  overflow: 'visible',
                }}
              >
                <Card className="border-0 bg-transparent" style={{ borderRadius: 28 }}>
                  <Card.Body>
                    <Stack gap={3}>
                      <Row className="align-items-center mb-2">
                        <Col>
                          <CategoryFilter categories={categories} selected={category} onSelect={setCategory} />
                        </Col>
                        <Col xs="auto">
                          <SmartSearch onSearch={setSearch} />
                        </Col>
                      </Row>
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
                      {loading && <div style={{ color: luxuryColors.accent }}>Loading tasks...</div>}
                      {error && <div style={{ color: 'red' }}>{error}</div>}
                      <TaskList
                        tasks={filteredTasks}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onToggleComplete={handleToggleComplete}
                      />
                    </Stack>
                    {/* Floating Add Task Button */}
                    <OverlayTrigger placement="left" overlay={<BSTooltip>Add Task</BSTooltip>}>
                      <Button
                        variant="warning"
                        className="rounded-circle"
                        style={{
                          position: 'absolute',
                          bottom: 28,
                          right: 28,
                          width: 56,
                          height: 56,
                          boxShadow: '0 4px 24px 0 rgba(255,215,0,0.18)',
                          zIndex: 10,
                          fontSize: 28,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: 0,
                        }}
                        onClick={() => setShowAddTask(true)}
                      >
                        <IconPlus size={32} />
                      </Button>
                    </OverlayTrigger>
                  </Card.Body>
                </Card>
              </motion.div>
              {/* Analytics Card */}
              {widgets.analytics && (
                <motion.div
                  layout
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={panelVariants}
                  transition={{ duration: 0.5, delay: 0.1, type: 'spring' }}
                  style={{
                    borderRadius: 22,
                    boxShadow: '0 8px 32px 0 rgba(0,0,0,0.10), 0 2px 8px 0 #232946',
                    background: luxuryColors.glass,
                    border: `1.5px solid ${luxuryColors.border}`,
                  }}
                >
                  <Card className="border-0 bg-transparent" style={{ borderRadius: 22 }}>
                    <Card.Body>
                      <div className="d-flex align-items-center mb-2">
                        <IconTrophy size={22} color="#FFD700" className="me-2" />
                        <span style={{ fontWeight: 700, color: luxuryColors.accent }}>Analytics</span>
                      </div>
                      <AnalyticsCharts tasks={tasks} />
                    </Card.Body>
                  </Card>
                </motion.div>
              )}
              {/* Pomodoro Card */}
              {widgets.pomodoro && (
                <motion.div
                  layout
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={panelVariants}
                  transition={{ duration: 0.5, delay: 0.15, type: 'spring' }}
                  style={{
                    borderRadius: 22,
                    boxShadow: '0 8px 32px 0 rgba(0,0,0,0.10), 0 2px 8px 0 #232946',
                    background: luxuryColors.glass,
                    border: `1.5px solid ${luxuryColors.border}`,
                  }}
                >
                  <Card className="border-0 bg-transparent" style={{ borderRadius: 22 }}>
                    <Card.Body>
                      <div className="d-flex align-items-center mb-2">
                        <IconBell size={22} color="#fd7e14" className="me-2" />
                        <span style={{ fontWeight: 700, color: luxuryColors.accent }}>Pomodoro Timer</span>
                      </div>
                      <PomodoroTimer />
                    </Card.Body>
                  </Card>
                </motion.div>
              )}
              {/* Milestones Card */}
              {widgets.milestones && (
                <motion.div
                  layout
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={panelVariants}
                  transition={{ duration: 0.5, delay: 0.2, type: 'spring' }}
                  style={{
                    borderRadius: 22,
                    boxShadow: '0 8px 32px 0 rgba(0,0,0,0.10), 0 2px 8px 0 #232946',
                    background: luxuryColors.glass,
                    border: `1.5px solid ${luxuryColors.border}`,
                  }}
                >
                  <Card className="border-0 bg-transparent" style={{ borderRadius: 22 }}>
                    <Card.Body>
                      <div className="d-flex align-items-center mb-2">
                        <IconTrophy size={22} color="#339af0" className="me-2" />
                        <span style={{ fontWeight: 700, color: luxuryColors.accent }}>Milestones</span>
                      </div>
                      <MilestoneProgress milestones={achievementMilestones} />
                    </Card.Body>
                  </Card>
                </motion.div>
              )}
              {/* Gamification Card */}
              <motion.div
                layout
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={panelVariants}
                transition={{ duration: 0.5, delay: 0.25, type: 'spring' }}
                style={{
                  borderRadius: 22,
                  boxShadow: '0 8px 32px 0 rgba(0,0,0,0.10), 0 2px 8px 0 #232946',
                  background: luxuryColors.glass,
                  border: `1.5px solid ${luxuryColors.border}`,
                }}
              >
                <Card className="border-0 bg-transparent" style={{ borderRadius: 22 }}>
                  <Card.Body>
                    <GamificationPanel
                      streak={3}
                      achievements={['Starter', 'First Streak']}
                      points={120}
                    />
                  </Card.Body>
                </Card>
              </motion.div>
            </Stack>
          </Col>
        </Row>
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
            onClick={handleCustomizerClose}
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
                onSave={handleCustomizerSave}
                onClose={handleCustomizerClose}
                isSaving={customizerSaving}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Dashboard;