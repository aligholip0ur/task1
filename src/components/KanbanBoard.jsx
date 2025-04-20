import React from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { useDispatch, useSelector } from "react-redux";
import { moveTask } from "./kanbanSlice";
import Column from "./Columns";

const KanbanBoard = () => {
  const { columns, tasks } = useSelector((state) => state.kanban);
  const dispatch = useDispatch();

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const task = tasks[draggableId];
    const dependencies = task.dependencies || [];

    if (destination.droppableId === "inprogress") {
      const invalidDeps = dependencies.filter(depId => {
        const depTask = tasks[depId];
        return !depTask || depTask.status === 'todo';
      });

      if (invalidDeps.length > 0) {
        const invalidTasks = invalidDeps.map(id => tasks[id]?.content || id);
        return;
      }
    }
    else if (destination.droppableId === "done") {
      const invalidDeps = dependencies.filter(depId => {
        const depTask = tasks[depId];
        return !depTask || depTask.status !== 'done';
      });

      if (invalidDeps.length > 0) {
        const invalidTasks = invalidDeps.map(id => tasks[id]?.content || id);
        return;
      }
    }

    dispatch(moveTask({ source, destination, draggableId }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Kanban Board
        </h1>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.values(columns).map((column) => (
              <Column
                key={column.id}
                column={column}
                tasks={column.taskIds.map((taskId) => tasks[taskId])}
                allTasks={tasks}
              />
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default KanbanBoard;