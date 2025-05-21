import React from 'react';
import { Button, Form, Card, Row, Col, Badge } from 'react-bootstrap';
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
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, type: 'spring', stiffness: 120 },
  }),
};

const DashboardCustomizer: React.FC<DashboardCustomizerProps> = ({ visible, onChange }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, ease: 'easeOut' }}
  >
    <h4 className="mb-4 fw-bold text-primary text-center">
      <Badge bg="success" className="me-2">GOAL MODE</Badge>
      Customize Your Power Dashboard
    </h4>
    <Row xs={1} md={3} className="g-4">
      {widgets.map((w, i) => (
        <Col key={w.key}>
          <motion.div
            custom={i}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            whileHover={{ scale: 1.04, boxShadow: '0 4px 32px rgba(0,0,0,0.12)' }}
          >
            <Card
              border={visible[w.key] ? 'success' : 'secondary'}
              className={`h-100 shadow-sm ${visible[w.key] ? 'bg-light' : ''}`}
            >
              <Card.Body>
                <div className="d-flex align-items-center mb-2">
                  <span className="fs-3 me-2 text-success">{w.icon}</span>
                  <Card.Title className="mb-0">{w.label}</Card.Title>
                </div>
                <Card.Text className="mb-3 text-muted" style={{ minHeight: 48 }}>
                  {w.desc}
                </Card.Text>
                <Form.Check
                  type="switch"
                  id={`switch-${w.key}`}
                  label={visible[w.key] ? 'Enabled' : 'Enable'}
                  checked={visible[w.key]}
                  onChange={e => onChange(w.key, e.target.checked)}
                  className="fw-semibold"
                />
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      ))}
    </Row>
    <div className="text-center mt-4">
      <motion.div whileTap={{ scale: 0.96 }}>
        <Button variant="success" size="lg" className="fw-bold px-5 shadow">
          Save Dashboard
        </Button>
      </motion.div>
    </div>
  </motion.div>
);

export default DashboardCustomizer;