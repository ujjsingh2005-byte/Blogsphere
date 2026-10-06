import { useContext } from 'react';
import { useAuth as useAuthFromContext } from '../context/AuthContext';

// Export hook from hooks directory for architectural compliance
export const useAuth = () => {
  return useAuthFromContext();
};

export default useAuth;
