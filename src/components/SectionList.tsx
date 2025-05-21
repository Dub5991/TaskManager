import React, { useState, useEffect } from 'react';
import { ListGroup, Button, InputGroup, FormControl } from 'react-bootstrap';
import { BsCollection, BsTrash } from 'react-icons/bs';

type Section = { id: string; name: string; notebookId: string };

interface Props {
  notebookId: string;
  selected: string | null;
  onSelect: (id: string) => void;
}

const SECTIONS_KEY = 'sections';

const SectionList: React.FC<Props> = ({ notebookId, selected, onSelect }) => {
  const [sections, setSections] = useState<Section[]>([]);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(SECTIONS_KEY);
    setSections(saved ? JSON.parse(saved) : []);
  }, [notebookId]);

  const save = (secs: Section[]) => {
    setSections(secs);
    localStorage.setItem(SECTIONS_KEY, JSON.stringify(secs));
  };

  const addSection = () => {
    if (!newName.trim()) return;
    const sec = { id: Date.now().toString(), name: newName.trim(), notebookId };
    save([sec, ...sections]);
    setNewName('');
  };

  const deleteSection = (id: string) => {
    save(sections.filter(sec => sec.id !== id));
    if (selected === id) onSelect('');
  };

  const filtered = sections.filter(sec => sec.notebookId === notebookId);

  return (
    <div style={{ borderBottom: '1px solid #e0e0e0', padding: 12 }}>
      <h6 className="mb-3 d-flex align-items-center">
        <BsCollection className="me-2" /> Sections
      </h6>
      <InputGroup className="mb-2">
        <FormControl
          size="sm"
          placeholder="New section"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addSection()}
        />
        <Button size="sm" variant="secondary" onClick={addSection}>Add</Button>
      </InputGroup>
      <ListGroup>
        {filtered.map(sec => (
          <ListGroup.Item
            key={sec.id}
            action
            active={selected === sec.id}
            onClick={() => onSelect(sec.id)}
            className="d-flex justify-content-between align-items-center"
            style={{ cursor: 'pointer', userSelect: 'none' }}
          >
            <span className="text-truncate">{sec.name}</span>
            <Button
              size="sm"
              variant="outline-danger"
              onClick={e => { e.stopPropagation(); deleteSection(sec.id); }}
              title="Delete section"
            >
              <BsTrash />
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default SectionList;