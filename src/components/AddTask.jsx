import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTask } from './kanbanSlice';

const AddTaskForm = ({ columnId }) => {
  const [content, setContent] = useState('');
  const [selectedDeps, setSelectedDeps] = useState([]);
  const dispatch = useDispatch();

  const tasks = useSelector((state) => state.kanban.tasks);

  const handleCheckboxChange = (taskId) => {
    setSelectedDeps((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      dispatch(addTask({ columnId, content, dependencies: selectedDeps }));
      setContent('');
      setSelectedDeps([]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-3">
      <div className="relative mb-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="New Task..."
          className="w-full p-3 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <div className="bg-white border p-3 rounded-lg max-h-40 overflow-y-auto mb-2">
        <p className="text-sm text-gray-600 mb-2">Dependencies:</p>
        {Object.values(tasks).map((task) => (
          <label key={task.id} className="flex items-center mb-1 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={selectedDeps.includes(task.id)}
              onChange={() => handleCheckboxChange(task.id)}
              className="mr-2"
            />
            {task.content}
          </label>
        ))}
      </div>
    </form>
  );
};

export default AddTaskForm;
