import React, { useMemo } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { Card, Container, Row, Col, ProgressBar } from 'react-bootstrap';
import { FaTrophy, FaTasks, FaFire } from 'react-icons/fa';
import MilestoneProgress from '../components/MilestoneProgress';

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
    description: 'Complete your first task.',
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

const Achievements: React.FC = () => {
  const { tasks } = useTaskContext();

  const achievements = useMemo(
    () =>
      achievementDefs.map(a => ({
        id: String(a.id),
        title: a.title,
        completed: a.check(tasks),
        description: a.description,
      })),
    [tasks]
  );

  const unlockedCount = achievements.filter(a => a.completed).length;

  return (
    <Container className="py-4" style={{ maxWidth: 1000 }}>
      <Card className="shadow-lg border-0 mb-4" style={{ borderRadius: 24 }}>
        <Card.Body>
          <Row className="align-items-center">
            <Col xs={12} md={8}>
              <h2 className="fw-bold mb-1" style={{ letterSpacing: 0.5 }}>
                <FaTrophy className="me-2 text-warning" />
                Achievements
              </h2>
              <div className="mb-2 text-muted" style={{ fontSize: 18 }}>
                <FaTasks className="me-2" />
                {unlockedCount} / {achievements.length} unlocked
              </div>
              <ProgressBar
                now={(unlockedCount / achievements.length) * 100}
                label={`${unlockedCount} / ${achievements.length}`}
                className="mb-3"
                style={{ height: 18, borderRadius: 10, fontWeight: 600 }}
              />
            </Col>
            <Col xs={12} md={4} className="text-center">
              <FaFire size={64} color="#fd7e14" className="mb-2" />
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <MilestoneProgress milestones={achievements} />
    </Container>
  );
};

export default Achievements;