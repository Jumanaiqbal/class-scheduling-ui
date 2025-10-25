import React, { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_USER_PREFERENCES':
      return { ...state, userPreferences: { ...state.userPreferences, ...action.payload } };
    default:
      return state;
  }
};

const initialState = {
  loading: false,
  userPreferences: {
    theme: 'light',
    notifications: true,
  },
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const setLoading = (loading) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setUserPreferences = (preferences) => {
    dispatch({ type: 'SET_USER_PREFERENCES', payload: preferences });
  };

  return (
    <AppContext.Provider value={{
      ...state,
      setLoading,
      setUserPreferences,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};