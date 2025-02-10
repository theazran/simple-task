import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle2, Circle, Code2, Star, GitFork } from 'lucide-react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface GithubStats {
  stars: number;
  forks: number;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [input, setInput] = useState('');
  const [githubStats, setGithubStats] = useState<GithubStats>({ stars: 0, forks: 0 });

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    fetch('https://api.github.com/repos/theazran/simple-task')
      .then(response => response.json())
      .then(data => {
        setGithubStats({
          stars: data.stargazers_count,
          forks: data.forks_count
        });
      })
      .catch(error => console.error('Error fetching GitHub stats:', error));
  }, []);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setTodos([...todos, { id: Date.now(), text: input.trim(), completed: false }]);
      setInput('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="relative min-h-screen bg-[#0A0A0A] text-white overflow-hidden">
      {/* Blur effects */}
      <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px]" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500/20 rounded-full blur-[128px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-6">
        <div className="max-w-2xl mx-auto backdrop-blur-sm">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Simple TASK
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-6">
                <a 
                  href="https://github.com/theazran/simple-task/stargazers"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-400 transition-colors"
                >
                  <Star className="w-4 h-4" />
                  <span>{githubStats.stars}</span>
                </a>
                <a 
                  href="https://github.com/theazran/simple-task/network/members"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-400 transition-colors"
                >
                  <GitFork className="w-4 h-4" />
                  <span>{githubStats.forks}</span>
                </a>
              </div>
              <a 
                href="https://github.com/theazran" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-400 transition-colors"
              >
                <Code2 className="w-4 h-4" />
                by theazran
              </a>
            </div>
          </div>
          
          <form onSubmit={addTodo} className="mb-8">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full bg-[#1A1A1A]/80 backdrop-blur-sm border border-[#333] rounded-lg p-4 pr-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add a new task..."
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-[#333] rounded-md transition-colors"
                aria-label="Add todo"
              >
                <Plus className="w-5 h-5 text-blue-500" />
              </button>
            </div>
          </form>

          <div className="space-y-2">
            {todos.map(todo => (
              <div 
                key={todo.id}
                className="group bg-[#1A1A1A]/80 backdrop-blur-sm rounded-lg p-4 flex items-center justify-between hover:bg-[#242424]/80 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className="text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    {todo.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-blue-500" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>
                  <span 
                    className={`text-sm ${
                      todo.completed ? 'line-through text-gray-500' : 'text-gray-200'
                    }`}
                  >
                    {todo.text}
                  </span>
                </div>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-500 transition-all"
                  aria-label="Delete todo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {todos.length > 0 && (
            <div className="mt-8 text-sm text-gray-500">
              {todos.filter(t => !t.completed).length} tasks remaining
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;