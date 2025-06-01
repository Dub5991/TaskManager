import React from 'react';
import { Form, ListGroup, Button } from 'react-bootstrap';

interface TaskAttachmentsProps {
  files: File[];
  onAdd: (file: File) => void;
  onRemove: (index: number) => void;
}

const TaskAttachments: React.FC<TaskAttachmentsProps> = ({ files, onAdd, onRemove }) => (
  <div>
    <Form.Control
      type="file"
      onChange={e => {
        const input = e.target as HTMLInputElement;
        if (input.files && input.files[0]) onAdd(input.files[0]);
      }}
      className="mb-2"
    />
    <ListGroup>
      {files.map((file, idx) => (
        <ListGroup.Item key={idx}>
          {file.name}
          <Button variant="outline-danger" size="sm" className="ms-2" onClick={() => onRemove(idx)}>
            Remove
          </Button>
        </ListGroup.Item>
      ))}
    </ListGroup>
  </div>
);

export default TaskAttachments;