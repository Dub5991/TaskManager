import React from 'react';
import { Form } from 'react-bootstrap';

interface RecurringTaskControlsProps {
  value: string;
  onChange: (val: string) => void;
}

const RecurringTaskControls: React.FC<RecurringTaskControlsProps> = ({ value, onChange }) => (
  <Form.Group className="mb-3">
    <Form.Label>Repeat</Form.Label>
    <Form.Select value={value} onChange={e => onChange(e.target.value)}>
      <option value="">None</option>
      <option value="daily">Daily</option>
      <option value="weekly">Weekly</option>
      <option value="monthly">Monthly</option>
      <option value="custom">Custom...</option>
    </Form.Select>
  </Form.Group>
);

export default RecurringTaskControls;