import { configureStore } from '@reduxjs/toolkit';
import kanbanReducer from '../components/kanbanSlice';
export const store = configureStore({
  reducer: {
    kanban: kanbanReducer,
  },
});