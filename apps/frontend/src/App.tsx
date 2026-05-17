import { useState } from 'react';
import { API_PREFIX } from '@gigflow/shared';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl max-w-md w-full text-center space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          GigFlow CRM
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          MERN Monorepo Initialized
        </p>
        
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-sm font-mono text-gray-600 dark:text-gray-300">
            Shared Constant API_PREFIX: <span className="font-bold text-blue-500">{API_PREFIX}</span>
          </p>
        </div>

        <button
          onClick={() => setCount((c) => c + 1)}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
        >
          Count is {count}
        </button>
      </div>
    </div>
  );
}

export default App;
