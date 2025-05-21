import React, { useState } from 'react';
import { ListGroup, Form, Button } from 'react-bootstrap';
import type { Comment } from '../types';

interface TaskCommentsProps {
  comments: Comment[];
  onAdd: (text: string) => void;
}

const TaskComments: React.FC<TaskCommentsProps> = ({ comments, onAdd }) => {
  const [input, setInput] = useState('');

  return (
    <div>
      <ListGroup className="mb-2">
        {comments.map(c => (
          <ListGroup.Item key={c.id}>
            <strong>{c.userId}</strong> <span className="text-muted" style={{ fontSize: '0.9em' }}>{new Date(c.createdAt).toLocaleString()}</span>
            <div>{c.text}</div>
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
          placeholder="Add a comment"
        />
        <Button type="submit" variant="outline-info" className="ms-2">
          Comment
        </Button>
      </Form>
    </div>
  );
};

export default TaskComments;