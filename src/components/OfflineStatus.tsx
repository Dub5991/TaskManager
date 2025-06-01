// OfflineStatus.tsx - Offline Notification Banner
import { useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';

// Shows a warning banner if the user is offline
function OfflineStatus() {
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

  if (!offline) return null;

  return (
    <Alert variant="warning" className="text-center mb-2">
      You are offline. Changes will sync when you reconnect.
    </Alert>
  );
}

export default OfflineStatus;