import React, { useState, useEffect } from 'react';
import { ListGroup, Button, InputGroup, FormControl } from 'react-bootstrap';
import { BsFileEarmarkText, BsTrash } from 'react-icons/bs';

type Page = { id: string; name: string; sectionId: string };

interface Props {
  sectionId: string;
  selected: string | null;
  onSelect: (id: string) => void;
}

const PAGES_KEY = 'pages';

const PageList: React.FC<Props> = ({ sectionId, selected, onSelect }) => {
  const [pages, setPages] = useState<Page[]>([]);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(PAGES_KEY);
    setPages(saved ? JSON.parse(saved) : []);
  }, [sectionId]);

  const save = (pgs: Page[]) => {
    setPages(pgs);
    localStorage.setItem(PAGES_KEY, JSON.stringify(pgs));
  };

  const addPage = () => {
    if (!newName.trim()) return;
    const pg = { id: Date.now().toString(), name: newName.trim(), sectionId };
    save([pg, ...pages]);
    setNewName('');
  };

  const deletePage = (id: string) => {
    save(pages.filter(pg => pg.id !== id));
    if (selected === id) onSelect('');
  };

  const filtered = pages.filter(pg => pg.sectionId === sectionId);

  return (
    <div style={{ borderBottom: '1px solid #e0e0e0', padding: 12 }}>
      <h6 className="mb-3 d-flex align-items-center">
        <BsFileEarmarkText className="me-2" /> Pages
      </h6>
      <InputGroup className="mb-2">
        <FormControl
          size="sm"
          placeholder="New page"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addPage()}
        />
        <Button size="sm" variant="success" onClick={addPage}>Add</Button>
      </InputGroup>
      <ListGroup>
        {filtered.map(pg => (
          <ListGroup.Item
            key={pg.id}
            action
            active={selected === pg.id}
            onClick={() => onSelect(pg.id)}
            className="d-flex justify-content-between align-items-center"
            style={{ cursor: 'pointer', userSelect: 'none' }}
          >
            <span className="text-truncate">{pg.name}</span>
            <Button
              size="sm"
              variant="outline-danger"
              onClick={e => { e.stopPropagation(); deletePage(pg.id); }}
              title="Delete page"
            >
              <BsTrash />
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default PageList;