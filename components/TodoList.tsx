
import React, { useState, useEffect, useCallback } from 'react';
import type { Todo } from '../types';
import { Icon } from './Icon';

export const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    try {
      const storedTodos = localStorage.getItem('todos');
      if (storedTodos) {
        setTodos(JSON.parse(storedTodos));
      }
    } catch (error) {
      console.error("Failed to load todos from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('todos', JSON.stringify(todos));
    } catch (error) {
      console.error("Failed to save todos to localStorage", error);
    }
  }, [todos]);

  const handleAddTodo = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const newTodo: Todo = {
        id: Date.now(),
        text: inputValue,
        completed: false,
      };
      setTodos(prevTodos => [...prevTodos, newTodo]);
      setInputValue('');
    }
  }, [inputValue]);

  const handleToggleTodo = (id: number) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = (id: number) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto">
      <form onSubmit={handleAddTodo} className="flex gap-2 mb-4">
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="Add a new task..."
          className="flex-grow bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors">
          <Icon name="plus" className="w-5 h-5" />
          <span>Add</span>
        </button>
      </form>
      <ul className="space-y-3 overflow-y-auto flex-grow pr-1">
        {todos.length === 0 && (
            <p className="text-center text-gray-400 mt-8">Your to-do list is empty. Add a task to get started!</p>
        )}
        {todos.map(todo => (
          <li
            key={todo.id}
            className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
              todo.completed ? 'bg-gray-700/50' : 'bg-gray-700'
            }`}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggleTodo(todo.id)}
              className="form-checkbox h-5 w-5 text-blue-500 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 cursor-pointer"
            />
            <span
              className={`flex-grow ml-4 cursor-pointer ${
                todo.completed ? 'line-through text-gray-500' : 'text-gray-200'
              }`}
              onClick={() => handleToggleTodo(todo.id)}
            >
              {todo.text}
            </span>
            <button
              onClick={() => handleDeleteTodo(todo.id)}
              className="text-gray-500 hover:text-red-500 transition-colors p-1 rounded-full"
            >
              <Icon name="trash" className="w-5 h-5" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
