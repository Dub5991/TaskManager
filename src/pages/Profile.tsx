import React, { useMemo, useState, useEffect, ChangeEvent } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useTaskContext } from '../context/TaskContext';
import GamificationPanel from '../components/GamificationPanel';
import { Card, Badge, ProgressBar, Row, Col, Button, Container, Form, Modal } from 'react-bootstrap';
import { FaUserCircle, FaEnvelope, FaSignOutAlt, FaTasks, FaTrophy, FaClock, FaFire, FaEdit, FaSave, FaTimes, FaUpload } from 'react-icons/fa';

function daysBetween(a: string, b: string) {
  return Math.floor((new Date(a).getTime() - new Date(b).getTime()) / (1000 * 60 * 60 * 24));
}

const LOCAL_STORAGE_KEY = 'profileImages';

function getStoredProfileImage(email: string | undefined): string | null {
  if (!email) return null;
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!data) return null;
    const parsed = JSON.parse(data);
    return parsed[email] || null;
  } catch {
    return null;
  }
}

function setStoredProfileImage(email: string | undefined, image: string) {
  if (!email) return;
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    const parsed = data ? JSON.parse(data) : {};
    parsed[email] = image;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
  } catch {
    // ignore
  }
}

const Profile: React.FC = () => {
  const { user, logout } = useAuth0();
  const { tasks } = useTaskContext();

  // Local state for editing profile
  const [showEdit, setShowEdit] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editPicture, setEditPicture] = useState(user?.picture || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(user?.picture || '');

  // Load stored image on mount or user change
  useEffect(() => {
    if (user?.email) {
      const stored = getStoredProfileImage(user.email);
      if (stored) {
        setEditPicture(stored);
        setImagePreview(stored);
      } else {
        setEditPicture(user.picture || '');
        setImagePreview(user.picture || '');
      }
      setEditName(user.name || '');
    }
    // eslint-disable-next-line
  }, [user?.email, user?.picture, user?.name]);

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

  // Handle image file selection
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setEditPicture(''); // Clear URL if uploading
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image URL input
  const handlePictureUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditPicture(e.target.value);
    setImageFile(null);
    setImagePreview(e.target.value);
  };

  // Simulate saving profile (in real app, call API)
  const handleSave = () => {
    let finalImage = imagePreview;
    if (imageFile && imagePreview) {
      // In a real app, upload imageFile and get a URL, then setEditPicture(url)
      setEditPicture(imagePreview); // For demo, use base64 preview
      finalImage = imagePreview;
    } else if (editPicture) {
      finalImage = editPicture;
    }
    setStoredProfileImage(user.email, finalImage);
    setImagePreview(finalImage);
    setShowEdit(false);
  };

  return (
    <Container className="py-4" style={{ maxWidth: 800 }}>
      <Card className="shadow-lg border-0 mb-4" style={{ borderRadius: 24 }}>
        <Card.Body>
          <Row className="align-items-center">
            <Col xs={12} md={3} className="text-center mb-3 mb-md-0">
              {imagePreview || user.picture ? (
                <img
                  src={imagePreview || user.picture}
                  alt={editName || user.name}
                  className="rounded-circle shadow"
                  style={{ width: 110, height: 110, objectFit: 'cover', border: '4px solid #f5e9c8' }}
                />
              ) : (
                <FaUserCircle size={110} color="#b4b8c5" />
              )}
            </Col>
            <Col xs={12} md={9}>
              <h2 className="fw-bold mb-1" style={{ letterSpacing: 0.5 }}>
                {editName || user.name}
                <Badge bg="info" className="ms-2 align-middle" style={{ fontSize: 14 }}>
                  <FaTasks className="me-1" /> {completedCount}/{totalCount} Tasks
                </Badge>
                <Button
                  variant="link"
                  size="sm"
                  className="ms-2 p-0 align-middle"
                  style={{ verticalAlign: 'middle' }}
                  onClick={() => {
                    setEditName(user.name || '');
                    // Use stored image if available
                    const stored = getStoredProfileImage(user.email);
                    setEditPicture(stored || user.picture || '');
                    setImagePreview(stored || user.picture || '');
                    setImageFile(null);
                    setShowEdit(true);
                  }}
                  aria-label="Edit Profile"
                >
                  <FaEdit />
                </Button>
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

      {/* Edit Profile Modal */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="editName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                placeholder="Enter your name"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="editPicture">
              <Form.Label>Profile Picture</Form.Label>
              <div className="mb-2">
                <Form.Control
                  type="text"
                  value={editPicture}
                  onChange={handlePictureUrlChange}
                  placeholder="Paste image URL"
                  disabled={!!imageFile}
                />
              </div>
              <div className="mb-2">
                <Form.Label className="d-block">Or upload an image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={!!editPicture}
                />
                <small className="text-muted">
                  {editPicture ? 'Clear the URL to enable file upload.' : ''}
                </small>
              </div>
              {imagePreview && (
                <div className="mt-2 text-center">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: '50%' }}
                  />
                </div>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEdit(false)}>
            <FaTimes className="me-1" /> Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            <FaSave className="me-1" /> Save
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Profile;