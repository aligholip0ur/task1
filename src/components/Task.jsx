import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { useSelector } from 'react-redux';

const Task = ({ task, index }) => {
  const allTasks = useSelector(state => state.kanban.tasks);

  const isDependencyDone = (depId) => {
    const depTask = allTasks[depId];
    return depTask && depTask.status === 'done';  
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-grab active:cursor-grabbing ${task.status === 'done' ? 'bg-green-100' : ''}`} // تغییر رنگ برای تسک‌های done
        >
          <div className="flex items-start">
            <div className="flex-1">
              <p className="text-gray-800 font-medium">{task.content}</p>

              {task.dependencies && task.dependencies.length > 0 && (
                <div className="mt-2 text-sm text-gray-500">
                  <span className="font-medium">وابسته به:</span>{' '}
                  {task.dependencies.map((depId, i) => (
                    <span
                      key={i}
                      className={`inline-block bg-gray-200 px-2 py-0.5 rounded mr-1 ${isDependencyDone(depId) ? 'bg-green-200' : 'bg-yellow-200'}`} // رنگ‌های وابسته به وضعیت
                      title={depId}
                    >
                      {allTasks[depId]?.content || depId}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <span className="text-gray-400 ml-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default Task;
