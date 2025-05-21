import React, { useState } from 'react';
import NotebookList from '../components/NotebookList';
import SectionList from '../components/SectionList';
import PageList from '../components/PageList';
import JournalPage from '../components/JournalPage';
import { Container, Row, Col } from 'react-bootstrap';

const Notes: React.FC = () => {
  const [selectedNotebook, setSelectedNotebook] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);

  // Sidebar is always visible on desktop, Offcanvas on mobile (handled in sidebar components)
  return (
    <Container fluid style={{ height: '100vh', padding: 0, background: 'linear-gradient(120deg, #f3f4f8 0%, #e0e7ef 100%)' }}>
      <Row style={{ height: '100vh', margin: 0 }}>
        <Col xs={12} md="auto" style={{ padding: 0, display: 'flex', flexDirection: 'column', minWidth: 220, maxWidth: 260, background: '#fff', borderRight: '1px solid #e0e0e0' }}>
          <NotebookList
            selected={selectedNotebook}
            onSelect={id => {
              setSelectedNotebook(id);
              setSelectedSection(null);
              setSelectedPage(null);
            }}
          />
          {selectedNotebook && (
            <SectionList
              notebookId={selectedNotebook}
              selected={selectedSection}
              onSelect={id => {
                setSelectedSection(id);
                setSelectedPage(null);
              }}
            />
          )}
          {selectedSection && (
            <PageList
              sectionId={selectedSection}
              selected={selectedPage}
              onSelect={setSelectedPage}
            />
          )}
        </Col>
        <Col style={{ padding: 0, minWidth: 0, background: '#f8f9fa', height: '100vh', overflow: 'auto' }}>
          {selectedPage ? (
            <JournalPage pageId={selectedPage} sectionId={selectedSection!} />
          ) : (
            <div className="d-flex justify-content-center align-items-center h-100 text-muted" style={{ fontSize: 24 }}>
              {selectedNotebook
                ? selectedSection
                  ? 'Select or create a page'
                  : 'Select or create a section'
                : 'Select or create a notebook'}
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Notes;