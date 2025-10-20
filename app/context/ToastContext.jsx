import React, { createContext, useContext, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import ToastItem from '../components/Toast';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
   const [toasts, setToasts] = useState([]);

   const showToast = (message, type = 'info', duration = 1500) => {
      const id = Date.now() + Math.random(); // Unique ID
      const newToast = { id, message, type, duration };

      setToasts((prev) => [...prev, newToast]);
   };

   const dismissToast = (id) => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
   };

   return (
      <ToastContext.Provider value={{ showToast }}>
         {children}
         {toasts.length > 0 && (
            <View style={styles.toastContainer}>
               {toasts.map((toast) => (
                  <ToastItem
                     key={toast.id}
                     id={toast.id}
                     message={toast.message}
                     type={toast.type}
                     duration={toast.duration}
                     onDismiss={dismissToast}
                  />
               ))}
            </View>
         )}
      </ToastContext.Provider>
   );
};

export const useToast = () => {
   const context = useContext(ToastContext);
   if (!context) {
      throw new Error('useToast must be used within ToastProvider');
   }
   return context;
};

const styles = StyleSheet.create({
   toastContainer: {
      position: 'absolute',
      top: 20,
      right: 0,
      zIndex: 9999,
      opacity: 1,
   },
});
