import { createContext, useContext, useState, useCallback } from 'react';

const LoadingContext = createContext(null);

export function LoadingProvider({ children }) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');

  const showLoader = useCallback((msg = '') => {
    setMessage(msg);
    setVisible(true);
  }, []);

  const hideLoader = useCallback(() => {
    setVisible(false);
    setMessage('');
  }, []);

  return (
    <LoadingContext.Provider value={{ visible, message, showLoader, hideLoader }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoader() {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error('useLoader debe usarse dentro de LoadingProvider');
  return ctx;
}
