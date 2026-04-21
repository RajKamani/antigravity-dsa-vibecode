import React, { createContext, useContext, useEffect, useReducer, ReactNode } from 'react';
import { AppState, Problem, MockSession, DesignQuestion } from '../types';
import { loadData, saveData } from '../engine/storage';
import { SAMPLE_PROBLEMS } from '../data/sampleProblems';

type Action =
  | { type: 'ADD_PROBLEM'; payload: Problem }
  | { type: 'UPDATE_PROBLEM'; payload: Problem }
  | { type: 'DELETE_PROBLEM'; payload: string }
  | { type: 'ADD_DESIGN_QUESTION'; payload: DesignQuestion }
  | { type: 'UPDATE_DESIGN_QUESTION'; payload: DesignQuestion }
  | { type: 'DELETE_DESIGN_QUESTION'; payload: string }
  | { type: 'ADD_MOCK_SESSION'; payload: MockSession }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppState['settings']> }
  | { type: 'REPLACE_STATE'; payload: AppState }
  | { type: 'RECORD_ACTIVITY' };

const isFirstLaunch = (): boolean => {
  return localStorage.getItem('dsa-tracker-data') === null;
};

const initialState: AppState = isFirstLaunch() 
  ? { ...loadData(), problems: SAMPLE_PROBLEMS } 
  : loadData();

const appReducer = (state: AppState, action: Action): AppState => {
  let newState: AppState;

  switch (action.type) {
    case 'ADD_PROBLEM':
      newState = { ...state, problems: [...state.problems, action.payload] };
      break;
    case 'UPDATE_PROBLEM':
      newState = {
        ...state,
        problems: state.problems.map(p => p.id === action.payload.id ? action.payload : p)
      };
      break;
    case 'DELETE_PROBLEM':
      newState = {
        ...state,
        problems: state.problems.filter(p => p.id !== action.payload)
      };
      break;
    case 'ADD_DESIGN_QUESTION':
      newState = { ...state, designQuestions: [...state.designQuestions, action.payload] };
      break;
    case 'UPDATE_DESIGN_QUESTION':
      newState = {
        ...state,
        designQuestions: state.designQuestions.map(d => d.id === action.payload.id ? action.payload : d)
      };
      break;
    case 'DELETE_DESIGN_QUESTION':
      newState = {
        ...state,
        designQuestions: state.designQuestions.filter(d => d.id !== action.payload)
      };
      break;
    case 'ADD_MOCK_SESSION':
      newState = { ...state, mockSessions: [...state.mockSessions, action.payload] };
      break;
    case 'UPDATE_SETTINGS':
      newState = { ...state, settings: { ...state.settings, ...action.payload } };
      break;
    case 'REPLACE_STATE':
      newState = action.payload;
      break;
    case 'RECORD_ACTIVITY':
      const today = new Date().toISOString().split('T')[0];
      if (state.streaks.lastActiveDate === today) {
        return state; // Already active today
      }
      
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      let newCurrentStreak = state.streaks.current;
      if (state.streaks.lastActiveDate === yesterdayStr) {
        newCurrentStreak += 1;
      } else {
        newCurrentStreak = 1; // Broken streak or first day
      }
      
      newState = {
        ...state,
        streaks: {
          current: newCurrentStreak,
          best: Math.max(state.streaks.best, newCurrentStreak),
          lastActiveDate: today
        }
      };
      break;
    default:
      return state;
  }

  saveData(newState);
  return newState;
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize data on first load if it was the first launch
  useEffect(() => {
    if (isFirstLaunch()) {
      saveData(state);
    }
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
