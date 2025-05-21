import React from 'react';
import { ProgressBar, ListGroup } from 'react-bootstrap';

interface Milestone {
  id: string;
  title: string;
  completed: boolean;
}

interface MilestoneProgressProps {
  milestones: Milestone[];
}

const MilestoneProgress: React.FC<MilestoneProgressProps> = ({ milestones }) => {
  const completed = milestones.filter(m => m.completed).length;
  const percent = milestones.length ? Math.round((completed / milestones.length) * 100) : 0;

  return (
    <div>
      <ProgressBar now={percent} label={`${percent}%`} className="mb-2" />
      <ListGroup>
        {milestones.map(m => (
          <ListGroup.Item key={m.id} variant={m.completed ? 'success' : ''}>
            {m.title}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default MilestoneProgress;