import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  columns: {
    todo: {
      id: 'todo',
      title: 'To Do',
      taskIds: [],
    },
    inprogress: {
      id: 'inprogress',
      title: 'In Progress',
      taskIds: [],
    },
    done: {
      id: 'done',
      title: 'Done',
      taskIds: [],
    },
  },
  tasks: {},
};

const kanbanSlice = createSlice({
  name: 'kanban',
  initialState,
  reducers: {
    addTask: (state, action) => {
      const { columnId, content } = action.payload;
      const newTaskId = `task-${Date.now()}`;
      
      state.tasks[newTaskId] = { 
        id: newTaskId, 
        content,
        createdAt: new Date().toISOString()
      };
      state.columns[columnId].taskIds.push(newTaskId);
    },
    moveTask: (state, action) => {
      const { source, destination } = action.payload;
      
      if (source.droppableId === destination.droppableId) {
        const column = state.columns[source.droppableId];
        const [removed] = column.taskIds.splice(source.index, 1);
        column.taskIds.splice(destination.index, 0, removed);
      } else {
        const sourceColumn = state.columns[source.droppableId];
        const destColumn = state.columns[destination.droppableId];
        const [removed] = sourceColumn.taskIds.splice(source.index, 1);
        destColumn.taskIds.splice(destination.index, 0, removed);
      }
    },
  },
});

export const { addTask, moveTask } = kanbanSlice.actions;
export default kanbanSlice.reducer;