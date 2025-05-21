import React, { useState, useEffect } from 'react';
import { ListGroup, Button, InputGroup, FormControl } from 'react-bootstrap';
import { BsJournalPlus, BsTrash } from 'react-icons/bs';

type Notebook = { id: string; name: string };

interface Props {
  selected: string | null;
  onSelect: (id: string) => void;
}

const NOTEBOOKS_KEY = 'notebooks';

const NotebookList: React.FC<Props> = ({ selected, onSelect }) => {
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(NOTEBOOKS_KEY);
    setNotebooks(saved ? JSON.parse(saved) : []);
  }, []);

  const save = (nbs: Notebook[]) => {
    setNotebooks(nbs);
    localStorage.setItem(NOTEBOOKS_KEY, JSON.stringify(nbs));
  };

  const addNotebook = () => {
    if (!newName.trim()) return;
    const nb = { id: Date.now().toString(), name: newName.trim() };
    save([nb, ...notebooks]);
    setNewName('');
  };

  const deleteNotebook = (id: string) => {
    save(notebooks.filter(nb => nb.id !== id));
    if (selected === id) onSelect('');
  };

  return (
    <div style={{ borderBottom: '1px solid #e0e0e0', padding: 12 }}>
      <h5 className="mb-3 d-flex align-items-center">
        <BsJournalPlus className="me-2" /> Notebooks
      </h5>
      <InputGroup className="mb-2">
        <FormControl
          size="sm"
          placeholder="New notebook"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addNotebook()}
        />
        <Button size="sm" variant="primary" onClick={addNotebook}>Add</Button>
      </InputGroup>
      <ListGroup>
        {notebooks.map(nb => (
          <ListGroup.Item
            key={nb.id}
            action
            active={selected === nb.id}
            onClick={() => onSelect(nb.id)}
            className="d-flex justify-content-between align-items-center"
            style={{ cursor: 'pointer', userSelect: 'none' }}
          >
            <span className="text-truncate">{nb.name}</span>
            <Button
              size="sm"
              variant="outline-danger"
              onClick={e => { e.stopPropagation(); deleteNotebook(nb.id); }}
              title="Delete notebook"
            >
              <BsTrash />
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default NotebookList;