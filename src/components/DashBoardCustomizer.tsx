import React from 'react';
import { Button, Form, Card, Row, Col, Container, Stack } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaChartLine, FaClock, FaFlagCheckered } from 'react-icons/fa';

const widgets = [
  { key: 'analytics', label: 'Analytics', icon: <FaChartLine />, desc: 'Track your progress with detailed analytics.' },
  { key: 'pomodoro', label: 'Pomodoro Timer', icon: <FaClock />, desc: 'Boost focus with time-boxed sprints.' },
  { key: 'milestones', label: 'Milestones', icon: <FaFlagCheckered />, desc: 'Celebrate big wins and key achievements.' },
];

interface DashboardCustomizerProps {
  visible: Record<string, boolean>;
  onChange: (key: string, show: boolean) => void;
  onSave?: () => void;
  onClose?: () => void;
  isSaving?: boolean;
}

const DashboardCustomizer: React.FC<DashboardCustomizerProps> = ({
  visible,
  onChange,
  onSave,
  onClose,
  isSaving,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: 'easeOut' }}
    style={{
      width: '100%',
      maxWidth: 700,
      margin: '0 auto',
      padding: '2rem 1rem',
      background: 'linear-gradient(135deg, #f8fafc 60%, #e0f7fa 100%)',
      borderRadius: 24,
      boxShadow: '0 8px 40px rgba(0,0,0,0.09)',
    }}
  >
    <Container fluid className="p-0">
      <div className="text-center mb-5">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 120 }}
        >
          <span
            style={{
              fontWeight: 700,
              fontSize: '2.1rem',
              color: '#1976d2',
              letterSpacing: 1,
              display: 'block',
              marginBottom: 8,
            }}
          >
            Dashboard Setup
          </span>
          <span style={{ color: '#607d8b', fontSize: '1.1rem' }}>
            Select which widgets you want to see on your dashboard.
          </span>
        </motion.div>
      </div>
      <Row xs={1} md={3} className="g-4 mb-4">
        {widgets.map((w, i) => (
          <Col key={w.key}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12 + 0.2, type: 'spring', stiffness: 120 }}
              whileHover={{ scale: 1.04, boxShadow: '0 6px 32px rgba(25,118,210,0.10)' }}
              style={{ height: '100%' }}
            >
              <Card
                className={`h-100 border-0 shadow-sm ${visible[w.key] ? 'bg-white' : 'bg-light'}`}
                style={{
                  borderRadius: 18,
                  transition: 'background 0.2s',
                  outline: visible[w.key] ? '2.5px solid #1976d2' : '2.5px solid transparent',
                }}
              >
                <Card.Body className="d-flex flex-column align-items-center justify-content-between">
                  <div className="mb-3" style={{
                    background: visible[w.key] ? 'linear-gradient(135deg, #1976d2 60%, #64b5f6 100%)' : '#eceff1',
                    borderRadius: '50%',
                    width: 54,
                    height: 54,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 12,
                  }}>
                    <span className="fs-2" style={{ color: visible[w.key] ? '#fff' : '#90a4ae' }}>{w.icon}</span>
                  </div>
                  <Card.Title className="mb-1 fw-bold text-center" style={{ fontSize: '1.08rem', color: '#1976d2' }}>
                    {w.label}
                  </Card.Title>
                  <Card.Text className="mb-3 text-center" style={{ color: '#607d8b', fontSize: '0.97rem', minHeight: 44 }}>
                    {w.desc}
                  </Card.Text>
                  <Form.Check
                    type="switch"
                    id={`switch-${w.key}`}
                    label={visible[w.key] ? 'Enabled' : 'Enable'}
                    checked={visible[w.key]}
                    onChange={e => onChange(w.key, e.target.checked)}
                    className="fw-semibold"
                    style={{ color: '#1976d2' }}
                  />
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>
      <Stack direction="horizontal" gap={3} className="justify-content-center mt-4 flex-wrap">
        <motion.div whileTap={{ scale: 0.97 }}>
          <Button
            variant="primary"
            size="lg"
            className="fw-bold px-5 shadow"
            type="button"
            onClick={onSave}
            disabled={isSaving}
            aria-label="Save dashboard"
            style={{
              minWidth: 180,
              borderRadius: 16,
              letterSpacing: 0.5,
              boxShadow: '0 2px 16px rgba(25,118,210,0.10)',
            }}
          >
            {isSaving ? 'Saving...' : 'Save Dashboard'}
          </Button>
        </motion.div>
        <motion.div whileTap={{ scale: 0.97 }}>
          <Button
            variant="light"
            size="lg"
            className="fw-bold px-4"
            onClick={onClose}
            aria-label="Close customizer"
            style={{
              minWidth: 60,
              borderRadius: 16,
              color: '#607d8b',
              border: '1.5px solid #b0bec5',
            }}
          >
            Cancel
          </Button>
        </motion.div>
      </Stack>
    </Container>
  </motion.div>
);

export default DashboardCustomizer;