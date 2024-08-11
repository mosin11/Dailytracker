// AlertMessage.js
import React from 'react';
import './css/SuccessMessage.css'; // For styling

const AlertMessage = ({ message, type, visible }) => {
  if (!visible) return null;
//console.log("{ message, type, visible }",{ message, type, visible })
  const alertClass = type === 'success' ? 'alert-success' : 'alert-danger';

  const getIconClass = (type) => {
    switch (type) {
      case 'success':
        return 'bi-check-circle';
      case 'error':
        return 'bi-x-circle';
      case 'warning':
        return 'bi-exclamation-circle';
      case 'update':
        return 'bi-pencil-square';
      case 'delete':
        return 'bi-trash';
      default:
        return 'bi-info-circle'; // Default icon if no match
    }
  };

  // Function to render messages
  const renderMessages = () => {
    if (Array.isArray(message)) {
      return message.map((msg, index) => (
        <div key={index}>
          <i className={`bi ${getIconClass(type)}`}/>
          <span> {msg}</span>
        </div>
      ));
    } else if (typeof message === 'object' && message !== null) {
      // Convert object values to an array and map
      return Object.values(message).map((msg, index) => (
        <div key={index}>
          <i className={`bi ${getIconClass(type)}`}/>
          <span> {msg}</span>
        </div>
      ));
    } else {
      // Fallback for other types (string or unexpected types)
      return (
        <div>
          <i className={`bi ${getIconClass(type)}`}/>
          <span> {message}</span>
        </div>
      );
    }
  };

  return (
    <div className={`alert ${alertClass} fixed-top`} style={{ top: '56px', padding: '5px 20px', zIndex: '1050' }}>
      {renderMessages()}
    </div>
  );
};

export default AlertMessage;
