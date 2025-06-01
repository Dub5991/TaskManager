import React, { useState, useEffect, useRef } from 'react';
import { Button, Form, Row, Col, Badge, Fade, ListGroup } from 'react-bootstrap';
import { motion } from 'framer-motion';
import MediaUploader from './MediaUploader';
import {
  FaSmile, FaFrown, FaMeh, FaAngry, FaGrinStars, FaTired, FaGrinHearts, FaSurprise, FaLaughBeam
} from 'react-icons/fa';

const JOURNAL_KEY = 'journalPages';
const PAGES_KEY = 'pages';

const moods = [
  { label: 'Happy', value: 'happy', icon: <FaSmile color="#ffc107" /> },
  { label: 'Neutral', value: 'neutral', icon: <FaMeh color="#6c757d" /> },
  { label: 'Sad', value: 'sad', icon: <FaFrown color="#0d6efd" /> },
  { label: 'Angry', value: 'angry', icon: <FaAngry color="#dc3545" /> },
  { label: 'Excited', value: 'excited', icon: <FaGrinStars color="#20c997" /> },
  { label: 'Tired', value: 'tired', icon: <FaTired color="#6f42c1" /> },
  { label: 'Grateful', value: 'grateful', icon: <FaGrinHearts color="#0dcaf0" /> },
  { label: 'Surprised', value: 'surprised', icon: <FaSurprise color="#fd7e14" /> },
  { label: 'Joyful', value: 'joyful', icon: <FaLaughBeam color="#ffc300" /> },
];

interface JournalData {
  text: string;
  mood: string;
  mediaUrl?: string;
  width?: number;
}

interface Props {
  pageId: string;
  sectionId: string;
}

const defaultWidth = 600;

const JournalPage: React.FC<Props> = ({ pageId, sectionId }) => {
  const [data, setData] = useState<JournalData>({ text: '', mood: 'happy', mediaUrl: '', width: defaultWidth });
  const [showSaved, setShowSaved] = useState(false);
  const saveTimeout = useRef<number | null>(null);
  const [entries, setEntries] = useState<{ id: string; name: string }[]>([]);

  // Helper for default data
  const defaultData = (): JournalData => ({ text: '', mood: 'happy', mediaUrl: '', width: defaultWidth });

  // Load data on mount/page change
  useEffect(() => {
    const saved = localStorage.getItem(JOURNAL_KEY);
    if (saved) {
      const all = JSON.parse(saved);
      if (all[pageId]) setData({ ...defaultData(), ...all[pageId] });
      else setData(defaultData());
    } else {
      setData(defaultData());
    }
    // Load entries for this section
    const pagesRaw = localStorage.getItem(PAGES_KEY);
    if (pagesRaw) {
      const allPages = JSON.parse(pagesRaw);
      setEntries(allPages.filter((p: any) => p.sectionId === sectionId));
    }
    // eslint-disable-next-line
  }, [pageId, sectionId]);

  // Save to localStorage and show "Saved!" feedback
  const save = (d: JournalData) => {
    setData(d);
    const saved = localStorage.getItem(JOURNAL_KEY);
    const all = saved ? JSON.parse(saved) : {};
    all[pageId] = d;
    localStorage.setItem(JOURNAL_KEY, JSON.stringify(all));
    setShowSaved(true);
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = window.setTimeout(() => setShowSaved(false), 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        flex: 1,
        background: '#fff',
        padding: 32,
        overflowY: 'auto',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start'
      }}
    >
      <div style={{
        width: data.width || defaultWidth,
        maxWidth: '100%',
        minWidth: 260,
        background: '#f8f9fa',
        borderRadius: 16,
        boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
        padding: 24,
        position: 'relative'
      }}>
        <Row className="mb-3">
          <Col xs={12} md={8}>
            <Form.Label>Mood</Form.Label>
            <div className="d-flex flex-wrap gap-2 mb-2">
              {moods.map(m => (
                <Button
                  key={m.value}
                  variant={data.mood === m.value ? 'warning' : 'outline-secondary'}
                  size="sm"
                  className="me-2 mb-2"
                  onClick={() => save({ ...data, mood: m.value })}
                  style={{ minWidth: 90, fontWeight: 600 }}
                  type="button"
                >
                  {m.icon} {m.label}
                </Button>
              ))}
            </div>
          </Col>
          <Col xs={12} md={4}>
            <Form.Label>Page Width</Form.Label>
            <Form.Range
              min={260}
              max={900}
              value={data.width || defaultWidth}
              onChange={e => save({ ...data, width: Number(e.target.value) })}
            />
            <Badge bg="info">{data.width || defaultWidth}px</Badge>
          </Col>
        </Row>
        <Form.Group className="mb-3">
          <Form.Label>Journal Entry</Form.Label>
          <Form.Control
            as="textarea"
            rows={10}
            value={data.text}
            onChange={e => save({ ...data, text: e.target.value })}
            placeholder="Write your thoughts, plans, or reflections here..."
            style={{ fontSize: '1.1em', minHeight: 220, background: '#fff' }}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Media</Form.Label>
          <MediaUploader
            value={data.mediaUrl}
            onChange={(url: string) => save({ ...data, mediaUrl: url })}
          />
          {data.mediaUrl && (
            <div className="mt-2">
              {data.mediaUrl.match(/^data:image/) ? (
                <img src={data.mediaUrl} alt="attachment" style={{ maxWidth: 300, borderRadius: 8 }} />
              ) : (
                <audio controls src={data.mediaUrl} />
              )}
            </div>
          )}
        </Form.Group>
        <Fade in={showSaved}>
          <div style={{
            position: 'absolute',
            top: 12,
            right: 24,
            background: '#d1e7dd',
            color: '#0f5132',
            borderRadius: 8,
            padding: '4px 16px',
            fontWeight: 600,
            fontSize: 16,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}>
            Saved!
          </div>
        </Fade>
        <div className="mt-4">
          <h6>All Entries in this Section</h6>
          <ListGroup>
            {entries.map(entry => (
              <ListGroup.Item
                key={entry.id}
                active={entry.id === pageId}
                style={{ cursor: 'pointer' }}
                onClick={() => window.location.reload()} // You can improve this to use state navigation
              >
                {entry.name}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      </div>
    </motion.div>
  );
};

export default JournalPage;