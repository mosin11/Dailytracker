import React, { createContext, useState, useContext } from 'react';
import AlertMessage from '../components/AlertMessage';

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
  const [message, setMessage] = useState('');
  const [type, setType] = useState('');
  const [visible, setVisible] = useState(false);

  const showMessage = (msg, alertType) => {
    setMessage(msg);
    setType(alertType);
    setVisible(true);
    setTimeout(() => setVisible(false), 5000); // Hide after 5 seconds
  };

  return (
    <AlertContext.Provider value={{ showMessage }}>
      {children}
      <AlertMessage message={message} type={type} visible={visible} />
    </AlertContext.Provider>
  );
};
