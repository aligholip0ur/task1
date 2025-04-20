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
      const { columnId, content, dependencies = [] } = action.payload;
      const newTaskId = `task-${Date.now()}`;

      state.tasks[newTaskId] = {
        id: newTaskId,
        content,
        createdAt: new Date().toISOString(),
        dependencies,
        status: columnId,
      };

      state.columns[columnId].taskIds.push(newTaskId);
    },

    moveTask: (state, action) => {
      const { source, destination, draggableId } = action.payload;

      if (source.droppableId === destination.droppableId && source.index === destination.index) {
        return;
      }

      const task = state.tasks[draggableId];

      // 1. اگر تسک به عقب برمی‌گردد (از done به inprogress)
      if (source.droppableId === 'done' && destination.droppableId === 'inprogress') {
        // تمام تسک‌هایی که به این تسک وابسته هستند باید از done به inprogress منتقل شوند
        Object.values(state.tasks).forEach(t => {
          if (t.dependencies && t.dependencies.includes(draggableId) && t.status === 'done') {
            const doneColumn = state.columns.done;
            const inprogressColumn = state.columns.inprogress;
            
            const index = doneColumn.taskIds.indexOf(t.id);
            if (index !== -1) {
              doneColumn.taskIds.splice(index, 1);
              inprogressColumn.taskIds.push(t.id);
              t.status = 'inprogress';
            }
          }
        });
      }
      // 2. اگر تسک به عقب برمی‌گردد (از inprogress/done به todo)
      else if (destination.droppableId === 'todo') {
        // تمام تسک‌هایی که به این تسک وابسته هستند باید به todo برگردند
        Object.values(state.tasks).forEach(t => {
          if (t.dependencies && t.dependencies.includes(draggableId)) {
            const currentColumn = state.columns[t.status];
            const todoColumn = state.columns.todo;
            
            const index = currentColumn.taskIds.indexOf(t.id);
            if (index !== -1) {
              currentColumn.taskIds.splice(index, 1);
              todoColumn.taskIds.push(t.id);
              t.status = 'todo';
            }
          }
        });
      }

      // 3. جابجایی تسک اصلی
      const sourceColumn = state.columns[source.droppableId];
      const destColumn = state.columns[destination.droppableId];
      const [removed] = sourceColumn.taskIds.splice(source.index, 1);
      destColumn.taskIds.splice(destination.index, 0, removed);
      task.status = destination.droppableId;

      // 4. اگر تسک به جلو می‌رود (به inprogress/done)
      if (destination.droppableId !== 'todo') {
        // بررسی تمام تسک‌هایی که این تسک به آنها وابسته است
        task.dependencies?.forEach(depId => {
          const depTask = state.tasks[depId];
          if (depTask && depTask.status === 'todo') {
            // وابستگی باید حداقل در inprogress باشد
            const todoColumn = state.columns.todo;
            const inprogressColumn = state.columns.inprogress;
            
            const index = todoColumn.taskIds.indexOf(depId);
            if (index !== -1) {
              todoColumn.taskIds.splice(index, 1);
              inprogressColumn.taskIds.push(depId);
              depTask.status = 'inprogress';
            }
          }
        });
      }
    },
  },
});

export const { addTask, moveTask } = kanbanSlice.actions;
export default kanbanSlice.reducer;