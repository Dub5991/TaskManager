import React, { useState } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';

interface SmartSearchProps {
  onSearch: (query: string) => void;
}

const SmartSearch: React.FC<SmartSearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  return (
    <Form
      className="mb-3"
      onSubmit={e => {
        e.preventDefault();
        onSearch(query);
      }}
    >
      <InputGroup>
        <Form.Control
          placeholder="Search tasks, labels, dates, etc."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <Button type="submit" variant="outline-primary">
          Search
        </Button>
      </InputGroup>
    </Form>
  );
};

export default SmartSearch;