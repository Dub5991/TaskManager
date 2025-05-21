import React, { useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';

const OfflineStatus: React.FC = () => {
  const [offline, setOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handle = () => setOffline(!navigator.onLine);
    window.addEventListener('online', handle);
    window.addEventListener('offline', handle);
    return () => {
      window.removeEventListener('online', handle);
      window.removeEventListener('offline', handle);
    };
  }, []);

  return offline ? (
    <Alert variant="warning" className="text-center mb-2">
      You are offline. Changes will sync when you reconnect.
    </Alert>
  ) : null;
};

export default OfflineStatus;