import React from 'react';
import { Row, Col, Card, Badge } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';

interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  description: string;
}

interface MilestoneProgressProps {
  milestones: Milestone[];
}

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

const MilestoneProgress: React.FC<MilestoneProgressProps> = ({ milestones }) => {
  return (
    <Row className="g-3">
      <AnimatePresence>
        {milestones.map(m => (
          <Col xs={12} sm={6} md={4} lg={3} key={m.id}>
            <motion.div
              layout
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={cardVariants}
              transition={{ duration: 0.3, type: 'spring' }}
            >
              <Card
                className="shadow-sm border-0 h-100"
                style={{
                  borderRadius: 16,
                  opacity: m.completed ? 1 : 0.5,
                  background: m.completed
                    ? 'linear-gradient(120deg, #fffbe6 0%, #ffe066 100%)'
                    : '#f8f9fa',
                  boxShadow: m.completed
                    ? '0 0 0 2px #ffe066'
                    : '0 0 0 1px #dee2e6',
                  transition: 'opacity 0.3s, box-shadow 0.3s',
                  filter: m.completed ? 'none' : 'grayscale(0.3)',
                }}
              >
                <Card.Body className="d-flex flex-column align-items-center justify-content-center text-center">
                  <Badge
                    bg={m.completed ? 'success' : 'secondary'}
                    className="mb-2"
                    style={{ fontSize: 14, letterSpacing: 0.5 }}
                  >
                    {m.completed ? 'Unlocked' : 'Locked'}
                  </Badge>
                  <Card.Title
                    className="fw-bold mb-2"
                    style={{
                      fontSize: 18,
                      color: m.completed ? '#856404' : '#adb5bd',
                      textShadow: m.completed ? '0 1px 0 #fffbe6' : 'none',
                    }}
                  >
                    {m.title}
                  </Card.Title>
                  {!m.completed && (
                    <Card.Text className="text-muted" style={{ fontSize: 15 }}>
                      {m.description}
                    </Card.Text>
                  )}
                  {m.completed && (
                    <span
                      style={{
                        fontSize: 32,
                        marginTop: 8,
                        color: '#ffd700',
                        filter: 'drop-shadow(0 2px 4px #ffe06688)',
                      }}
                      role="img"
                      aria-label="Trophy"
                    >
                      🏆
                    </span>
                  )}
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        ))}
      </AnimatePresence>
    </Row>
  );
};

export default MilestoneProgress;