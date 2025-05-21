import React, { useMemo } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useTaskContext } from '../context/TaskContext';
import GamificationPanel from '../components/GamificationPanel';
import { Card, Badge, ProgressBar, Row, Col, Button, Container } from 'react-bootstrap';
import { FaUserCircle, FaEnvelope, FaSignOutAlt, FaTasks, FaTrophy, FaClock, FaFire } from 'react-icons/fa';

function daysBetween(a: string, b: string) {
  return Math.floor((new Date(a).getTime() - new Date(b).getTime()) / (1000 * 60 * 60 * 24));
}

const Profile: React.FC = () => {
  const { user, logout } = useAuth0();
  const { tasks } = useTaskContext();

  const {
    completedCount,
    totalCount,
    percentComplete,
    streak,
    avgCompletionTime,
  } = useMemo(() => {
    const completedTasks = tasks
      .filter(t => t.completed && t.completedAt && t.createdAt)
      .sort((a, b) => (a.completedAt! > b.completedAt! ? 1 : -1));
    const completed = completedTasks.length;
    const total = tasks.length;
    const percent = total ? Math.round((completed / total) * 100) : 0;

    // Calculate streak (consecutive days with at least one completion)
    let streak = 0;
    let lastDate: string | null = null;
    for (let i = completedTasks.length - 1; i >= 0; i--) {
      const day = completedTasks[i].completedAt!.slice(0, 10);
      if (!lastDate) {
        lastDate = day;
        streak = 1;
      } else {
        const diff = daysBetween(lastDate, day);
        if (diff === 1) {
          streak++;
          lastDate = day;
        } else if (diff === 0) {
          // Same day, continue
        } else {
          break;
        }
      }
    }

    // Calculate average completion time (in hours)
    let avgCompletionTime = 0;
    if (completedTasks.length > 0) {
      const totalMs = completedTasks.reduce((sum, t) => {
        const created = new Date(t.createdAt).getTime();
        const completed = new Date(t.completedAt!).getTime();
        return sum + (completed - created);
      }, 0);
      avgCompletionTime = Math.round((totalMs / completedTasks.length) / (1000 * 60 * 60) * 10) / 10;
    }

    return {
      completedCount: completed,
      totalCount: total,
      percentComplete: percent,
      streak,
      avgCompletionTime,
    };
  }, [tasks]);

  if (!user) return null;

  return (
    <Container className="py-4" style={{ maxWidth: 800 }}>
      <Card className="shadow-lg border-0 mb-4" style={{ borderRadius: 24 }}>
        <Card.Body>
          <Row className="align-items-center">
            <Col xs={12} md={3} className="text-center mb-3 mb-md-0">
              {user.picture ? (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="rounded-circle shadow"
                  style={{ width: 110, height: 110, objectFit: 'cover', border: '4px solid #f5e9c8' }}
                />
              ) : (
                <FaUserCircle size={110} color="#b4b8c5" />
              )}
            </Col>
            <Col xs={12} md={9}>
              <h2 className="fw-bold mb-1" style={{ letterSpacing: 0.5 }}>
                {user.name}
                <Badge bg="info" className="ms-2 align-middle" style={{ fontSize: 14 }}>
                  <FaTasks className="me-1" /> {completedCount}/{totalCount} Tasks
                </Badge>
              </h2>
              <div className="mb-2 text-muted" style={{ fontSize: 18 }}>
                <FaEnvelope className="me-2" />
                {user.email}
              </div>
              <Button
                variant="outline-danger"
                size="sm"
                className="mt-2"
                onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
              >
                <FaSignOutAlt className="me-1" /> Log Out
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="shadow-sm border-0 mb-4" style={{ borderRadius: 18 }}>
        <Card.Body>
          <Row>
            <Col xs={12} md={6} className="mb-3 mb-md-0">
              <h5 className="fw-bold mb-2">
                <FaTrophy className="me-2 text-warning" />
                Productivity Stats
              </h5>
              <div className="mb-2">
                <span className="fw-semibold">Total Tasks:</span> {totalCount}
              </div>
              <div className="mb-2">
                <span className="fw-semibold">Completed:</span> {completedCount}
              </div>
              <div className="mb-2">
                <span className="fw-semibold">Completion Rate:</span>
                <Badge bg="success" className="ms-2">{percentComplete}%</Badge>
              </div>
              <ProgressBar
                now={percentComplete}
                label={`${percentComplete}% Complete`}
                className="mb-3"
                style={{ height: 18, borderRadius: 10, fontWeight: 600 }}
              />
            </Col>
            <Col xs={12} md={6}>
              <h5 className="fw-bold mb-2">
                <FaFire className="me-2 text-danger" />
                Streak & Time
              </h5>
              <div className="mb-2">
                <Badge bg="success" className="me-2">
                  🔥 Current Streak
                </Badge>
                <span className="fw-semibold">{streak} day{streak === 1 ? '' : 's'}</span>
              </div>
              <div className="mb-2">
                <Badge bg="secondary" className="me-2">
                  <FaClock className="me-1" />
                  Avg. Completion Time
                </Badge>
                <span className="fw-semibold">
                  {avgCompletionTime > 0 ? `${avgCompletionTime} hours` : 'N/A'}
                </span>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <GamificationPanel
        streak={streak}
        achievements={['Starter', 'First Streak']}
        points={120}
      />
    </Container>
  );
};

export default Profile;