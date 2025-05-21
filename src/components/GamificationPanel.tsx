import React from 'react';
import { Card, Badge } from 'react-bootstrap';

interface GamificationPanelProps {
  streak: number;
  achievements: string[];
  points: number;
}

const GamificationPanel: React.FC<GamificationPanelProps> = ({ streak, achievements, points }) => (
  <Card className="mb-3">
    <Card.Body>
      <h5>
        <Badge bg="success" className="me-2">🔥 Streak</Badge>
        {streak} days
      </h5>
      <h6>
        <Badge bg="info" className="me-2">🏆 Points</Badge>
        {points}
      </h6>
      <div>
        <Badge bg="warning" className="me-2">Achievements:</Badge>
        {achievements.length === 0 ? 'None yet' : achievements.map(a => (
          <Badge key={a} bg="secondary" className="me-1">{a}</Badge>
        ))}
      </div>
    </Card.Body>
  </Card>
);

export default GamificationPanel;