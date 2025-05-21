import React from 'react';
import { ListGroup, Form, Button } from 'react-bootstrap';
import type { Subtask } from '../types';

interface SubtaskListProps {
  subtasks: Subtask[];
  onToggle: (id: string) => void;
  onAdd: (title: string) => void;
}

const SubtaskList: React.FC<SubtaskListProps> = ({ subtasks, onToggle, onAdd }) => {
  const [input, setInput] = React.useState('');

  return (
    <div>
      <ListGroup className="mb-2">
        {subtasks.map(st => (
          <ListGroup.Item key={st.id}>
            <Form.Check
              type="checkbox"
              checked={st.completed}
              onChange={() => onToggle(st.id)}
              label={st.title}
            />
          </ListGroup.Item>
        ))}
      </ListGroup>
      <Form
        onSubmit={e => {
          e.preventDefault();
          if (input.trim()) {
            onAdd(input.trim());
            setInput('');
          }
        }}
        className="d-flex"
      >
        <Form.Control
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Add subtask"
        />
        <Button type="submit" variant="outline-primary" className="ms-2">
          Add
        </Button>
      </Form>
    </div>
  );
};

export default SubtaskList;