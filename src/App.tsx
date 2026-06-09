import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import Header from './components/Header';
import TaskBoard from './components/TaskBoard';
import AddTaskModal from './components/AddTaskModal';
import type { Task } from './types';

const INITIAL_TASKS: Task[] = [
  { id: '1', title: 'Pesquisa de UX', description: 'Coletar referências de design', status: 'done', priority: 'medium', manager: 'Ana', client: 'Sicoob', operationType: 'Design', value: 1500, createdAt: Date.now() - 100000 },
  { id: '2', title: 'Setup do Projeto', description: 'Inicializar React e Vite', status: 'in-progress', priority: 'high', manager: 'Carlos', client: 'Interno', operationType: 'Desenvolvimento', createdAt: Date.now() - 50000 },
  { id: '3', title: 'Implementar dnd-kit', description: 'Adicionar funcionalidade de drag and drop nas colunas.', status: 'todo', priority: 'high', manager: 'Beatriz', client: 'Sicoob', operationType: 'Desenvolvimento', value: 3200, createdAt: Date.now() },
];

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('nexus_tasks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_TASKS;
      }
    }
    return INITIAL_TASKS;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showWarning, setShowWarning] = useState(true);

  useEffect(() => {
    localStorage.setItem('nexus_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (newTask: Task) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleClearTasks = () => {
    if (window.confirm('Tem certeza que deseja limpar todas as tarefas?')) {
      setTasks([]);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        <Header tasks={tasks} onAddTaskClick={() => setIsModalOpen(true)} onClearTasks={handleClearTasks} />
        <main>
          <TaskBoard tasks={tasks} setTasks={setTasks} />
        </main>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <AddTaskModal
            onClose={() => setIsModalOpen(false)}
            onAddTask={handleAddTask}
          />
        )}
        
        {showWarning && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative"
            >
              <div className="flex items-center gap-3 mb-4 text-amber-500">
                <AlertTriangle size={32} />
                <h2 className="text-xl font-semibold text-slate-100">Aviso do Sistema</h2>
              </div>
              <p className="text-slate-300 mb-6">
                Este sistema utiliza o <strong>Web Storage (Local Storage)</strong> do seu navegador. 
                As informações não possuem persistência em um banco de dados real. 
                Se você limpar os dados de navegação, suas tarefas serão perdidas.
              </p>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowWarning(false)}
                  className="bg-primary hover:bg-secondary text-white px-6 py-2.5 rounded-xl font-medium transition-colors duration-200 shadow-sm"
                >
                  Entendi
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;

