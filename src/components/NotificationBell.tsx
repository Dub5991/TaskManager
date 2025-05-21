import React from 'react';
import { OverlayTrigger, Tooltip, Badge } from 'react-bootstrap';
import { BsBell } from 'react-icons/bs';

interface NotificationBellProps {
  count: number;
  onClick: () => void;
}

function NotificationBell({ count, onClick }: NotificationBellProps) {
  return (
    <OverlayTrigger
      placement="bottom"
      overlay={<Tooltip id="notification-bell-tooltip">Notifications</Tooltip>}
    >
      <span
        style={{ cursor: 'pointer', position: 'relative', display: 'inline-block' }}
        onClick={onClick}
        tabIndex={0}
        role="button"
        aria-label="Notifications"
        onKeyPress={e => {
          if (e.key === 'Enter' || e.key === ' ') onClick();
        }}
      >
        <BsBell size={24} />
        {count > 0 && (
          <Badge
            bg="danger"
            pill
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              transform: 'translate(50%,-50%)',
              fontSize: '0.75em',
            }}
          >
            {count}
          </Badge>
        )}
      </span>
    </OverlayTrigger>
  );
}

export default NotificationBell;