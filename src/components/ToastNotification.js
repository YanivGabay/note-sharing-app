// src/components/ToastNotification.js
import React from 'react';

const ToastNotification = ({ showToast, setShowToast, toastMessage }) => {
  return (
    showToast && (
      <div className="toast show position-fixed bottom-0 end-0 p-3" style={{ zIndex: 5 }}>
        <div className="toast-header bg-success">
          <strong className="me-auto">Notification</strong>
          <button type="button" className="btn-close" onClick={() => setShowToast(false)}></button>
        </div>
        <div className="toast-body">
          {toastMessage}
        </div>
      </div>
    )
  );
};

export default ToastNotification;
