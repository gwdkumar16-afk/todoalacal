
import React, { useState } from 'react';
import { TodoList } from './components/TodoList';
import { AlarmClock } from './components/AlarmClock';
import { ScientificCalculator } from './components/ScientificCalculator';
import { Icon } from './components/Icon';

type Tab = 'todo' | 'alarm' | 'calculator';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('todo');

  const renderContent = () => {
    switch (activeTab) {
      case 'todo':
        return <TodoList />;
      case 'alarm':
        return <AlarmClock />;
      case 'calculator':
        return <ScientificCalculator />;
      default:
        return <TodoList />;
    }
  };

  const NavButton: React.FC<{ tabName: Tab; label: string; icon: 'list' | 'alarm' | 'calculator' }> = ({ tabName, label, icon }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-2 p-3 sm:p-4 text-sm sm:text-base font-medium transition-all duration-300 rounded-lg ${
        activeTab === tabName
          ? 'bg-blue-600 text-white shadow-lg'
          : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
      }`}
    >
      <Icon name={icon} className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 font-sans">
      <div className="w-full max-w-4xl mx-auto flex flex-col h-full">
        <header className="text-center mb-6">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
            Productivity Hub
          </h1>
          <p className="text-gray-400 mt-2">Your all-in-one assistant.</p>
        </header>

        <main className="flex-grow bg-gray-800 rounded-xl shadow-2xl overflow-hidden flex flex-col">
          <nav className="flex items-stretch p-2 bg-gray-900/50 gap-2">
            <NavButton tabName="todo" label="To-Do List" icon="list" />
            <NavButton tabName="alarm" label="Alarm Clock" icon="alarm" />
            <NavButton tabName="calculator" label="Calculator" icon="calculator" />
          </nav>
          <div className="flex-grow p-4 sm:p-6 overflow-y-auto">
            {renderContent()}
          </div>
        </main>
        
        <footer className="text-center mt-6 text-gray-500 text-sm">
            <p>Built with React, TypeScript, and Tailwind CSS.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
