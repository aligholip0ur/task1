import React from 'react';
import { Droppable } from "@hello-pangea/dnd";
import Task from './Task';
import AddTaskForm from './AddTask';

const Column = ({ column, tasks }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-[500px]">
      <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600">
        <h2 className="text-lg font-semibold text-white text-center">
          {column.title}
        </h2>
      </div>
      
      {column.id === 'todo' && (
        <div className="px-4 pt-3">
          <AddTaskForm columnId={column.id} />
        </div>
      )}
      
      <Droppable droppableId={column.id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex-1 overflow-y-auto px-4 pb-4"
            style={{ maxHeight: 'calc(100vh - 220px)' }}
          >
            <div className="space-y-3">
              {tasks.map((task, index) => (
                <Task key={task.id} task={task} index={index} />
              ))}
              {provided.placeholder}
            </div>
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;