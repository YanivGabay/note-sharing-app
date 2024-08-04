import React from 'react';
import { useNotification } from '../NotificationContext';

const ToastNotification = () => {
  const { notification,closeNotify } = useNotification();

  if (!notification || !notification.show) {
    return null;
  }

  return (
    <div className={`toast show position-fixed bottom-0 end-0 p-3 bg-${notification.type}`} style={{ zIndex: 5 }}>
      <div className="toast-header">
        <strong className="me-auto">Notification</strong>
        <button type="button" className="btn-close" onClick={closeNotify}></button>
      </div>
      <div className="toast-body">
        {notification.message}
      </div>
    </div>
  );
};

export default ToastNotification;
