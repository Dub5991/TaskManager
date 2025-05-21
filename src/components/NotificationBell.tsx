import React from 'react';
import { OverlayTrigger, Tooltip, Badge } from 'react-bootstrap';
import { BsBell } from 'react-icons/bs';

interface NotificationBellProps {
  count: number;
  onClick: () => void;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ count, onClick }) => (
  <OverlayTrigger
    placement="bottom"
    overlay={<Tooltip>Notifications</Tooltip>}
  >
    <span style={{ cursor: 'pointer', position: 'relative' }} onClick={onClick}>
      <BsBell size={24} />
      {count > 0 && (
        <Badge bg="danger" pill style={{ position: 'absolute', top: 0, right: 0 }}>
          {count}
        </Badge>
      )}
    </span>
  </OverlayTrigger>
);

export default NotificationBell;