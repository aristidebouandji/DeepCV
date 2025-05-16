import React, { createContext, useContext, useReducer } from 'react';

// Types
export type Template = 'modern' | 'classic' | 'minimal' | 'creative';
export type Language = 'fr' | 'en';

export interface CVState {
  originalCV: string | null;
  jobOffer: string | null;
  optimizedCV: string | null;
  selectedTemplate: Template;
  language: Language;
  isProcessing: boolean;
  error: string | null;
}

type CVAction =
  | { type: 'SET_ORIGINAL_CV'; payload: string }
  | { type: 'SET_JOB_OFFER'; payload: string }
  | { type: 'SET_OPTIMIZED_CV'; payload: string }
  | { type: 'SET_TEMPLATE'; payload: Template }
  | { type: 'SET_LANGUAGE'; payload: Language }
  | { type: 'SET_PROCESSING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET' };

interface CVContextProps {
  state: CVState;
  dispatch: React.Dispatch<CVAction>;
}

// Initial state
const initialState: CVState = {
  originalCV: null,
  jobOffer: null,
  optimizedCV: null,
  selectedTemplate: 'modern',
  language: 'fr',
  isProcessing: false,
  error: null,
};

// Create context
const CVContext = createContext<CVContextProps | undefined>(undefined);

// Reducer
function cvReducer(state: CVState, action: CVAction): CVState {
  switch (action.type) {
    case 'SET_ORIGINAL_CV':
      return { ...state, originalCV: action.payload };
    case 'SET_JOB_OFFER':
      return { ...state, jobOffer: action.payload };
    case 'SET_OPTIMIZED_CV':
      return { ...state, optimizedCV: action.payload, isProcessing: false };
    case 'SET_TEMPLATE':
      return { ...state, selectedTemplate: action.payload };
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    case 'SET_PROCESSING':
      return { ...state, isProcessing: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isProcessing: false };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

// Provider component
export function CVProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cvReducer, initialState);
  
  return (
    <CVContext.Provider value={{ state, dispatch }}>
      {children}
    </CVContext.Provider>
  );
}

// Custom hook for using the context
export function useCVContext() {
  const context = useContext(CVContext);
  
  if (context === undefined) {
    throw new Error('useCVContext must be used within a CVProvider');
  }
  
  return context;
}