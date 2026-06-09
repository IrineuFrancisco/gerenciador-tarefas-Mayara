import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, AlertCircle } from 'lucide-react';
import type { Task, Priority, Status } from '../types';

interface AddTaskModalProps {
  onClose: () => void;
  onAddTask: (task: Task) => void;
}

export default function AddTaskModal({ onClose, onAddTask }: AddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [manager, setManager] = useState('');
  const [client, setClient] = useState('');
  const [operationType, setOperationType] = useState('');
  const [value, setValue] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [status, setStatus] = useState<Status>('todo');
  const [error, setError] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('O título é obrigatório.');
      return;
    }

    const newTask: Task = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      manager: manager.trim(),
      client: client.trim(),
      operationType: operationType.trim(),
      value: value ? parseFloat(value.replace(',', '.')) : undefined,
      progress: 0,
      createdAt: Date.now(),
    };

    onAddTask(newTask);
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const priorityOptions: { value: Priority; label: string; activeClass: string; inactiveClass: string }[] = [
    {
      value: 'low',
      label: 'Baixa',
      activeClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.15)]',
      inactiveClass: 'border-slate-700/60 text-slate-400 hover:border-emerald-500/30 hover:text-emerald-400/80 bg-slate-800/20'
    },
    {
      value: 'medium',
      label: 'Média',
      activeClass: 'bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.15)]',
      inactiveClass: 'border-slate-700/60 text-slate-400 hover:border-amber-500/30 hover:text-amber-400/80 bg-slate-800/20'
    },
    {
      value: 'high',
      label: 'Alta',
      activeClass: 'bg-rose-500/20 text-rose-400 border-rose-500/50 shadow-[0_0_12px_rgba(244,63,94,0.15)]',
      inactiveClass: 'border-slate-700/60 text-slate-400 hover:border-rose-500/30 hover:text-rose-400/80 bg-slate-800/20'
    },
  ];

  const statusOptions: { value: Status; label: string; activeClass: string; inactiveClass: string }[] = [
    {
      value: 'todo',
      label: 'A Fazer',
      activeClass: 'bg-primary/20 text-primary border-primary/50 shadow-[0_0_12px_rgba(59,130,246,0.15)]',
      inactiveClass: 'border-slate-700/60 text-slate-400 hover:border-primary/30 hover:text-primary/80 bg-slate-800/20'
    },
    {
      value: 'in-progress',
      label: 'Em Progresso',
      activeClass: 'bg-secondary/20 text-secondary border-secondary/50 shadow-[0_0_12px_rgba(139,92,246,0.15)]',
      inactiveClass: 'border-slate-700/60 text-slate-400 hover:border-secondary/30 hover:text-secondary/80 bg-slate-800/20'
    },
    {
      value: 'done',
      label: 'Concluído',
      activeClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.15)]',
      inactiveClass: 'border-slate-700/60 text-slate-400 hover:border-emerald-500/30 hover:text-emerald-400/80 bg-slate-800/20'
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleOverlayClick}
      className="fixed inset-0 bg-slate-950/50 backdrop-blur-md z-50 flex items-center justify-center p-4"
    >
      <motion.div
        ref={modalRef}
        initial={{ scale: 0.95, y: 10, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 10, opacity: 0 }}
        transition={{ type: 'spring', duration: 0.4 }}
        className="glass rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative border border-slate-700/40"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50 bg-slate-800/20">
          <h2 className="text-xl font-semibold text-slate-100">
            Nova Tarefa
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors p-1.5 rounded-lg hover:bg-slate-800/40"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {error && (
            <div className="flex items-center gap-2 text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 px-4 py-2.5 rounded-xl">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Title input */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="task-title" className="text-sm font-medium text-slate-300">
              Título
            </label>
            <input
              id="task-title"
              type="text"
              placeholder="Ex: Otimizar consultas de banco de dados"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              className="bg-slate-900/60 border border-slate-700/50 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200"
              autoFocus
            />
          </div>

          {/* Description textarea */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="task-desc" className="text-sm font-medium text-slate-300">
              Descrição
            </label>
            <textarea
              id="task-desc"
              placeholder="Descreva brevemente os detalhes e requisitos da tarefa..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="bg-slate-900/60 border border-slate-700/50 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Manager input */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="task-manager" className="text-sm font-medium text-slate-300">
                Gerente Responsável
              </label>
              <input
                id="task-manager"
                type="text"
                placeholder="Nome do gerente"
                value={manager}
                onChange={(e) => setManager(e.target.value)}
                className="bg-slate-900/60 border border-slate-700/50 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200"
              />
            </div>

            {/* Client input */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="task-client" className="text-sm font-medium text-slate-300">
                Cliente
              </label>
              <input
                id="task-client"
                type="text"
                placeholder="Nome do cliente"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                className="bg-slate-900/60 border border-slate-700/50 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200"
              />
            </div>

            {/* Operation Type input */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="task-operation" className="text-sm font-medium text-slate-300">
                Tipo de Operação
              </label>
              <input
                id="task-operation"
                type="text"
                placeholder="Ex: Empréstimo"
                value={operationType}
                onChange={(e) => setOperationType(e.target.value)}
                className="bg-slate-900/60 border border-slate-700/50 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200"
              />
            </div>

            {/* Value input */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="task-value" className="text-sm font-medium text-slate-300">
                Valor (Opcional)
              </label>
              <input
                id="task-value"
                type="number"
                step="0.01"
                placeholder="R$ 0,00"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="bg-slate-900/60 border border-slate-700/50 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200"
              />
            </div>
          </div>

          {/* Priority selector */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-300">Prioridade</span>
            <div className="grid grid-cols-3 gap-3">
              {priorityOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPriority(opt.value)}
                  className={`py-2 px-3 rounded-xl border text-sm font-medium transition-all duration-200 text-center ${priority === opt.value ? opt.activeClass : opt.inactiveClass
                    }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Status selector */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-300">Status Inicial</span>
            <div className="grid grid-cols-3 gap-3">
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStatus(opt.value)}
                  className={`py-2 px-3 rounded-xl border text-sm font-medium transition-all duration-200 text-center ${status === opt.value ? opt.activeClass : opt.inactiveClass
                    }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 mt-2 pt-4 border-t border-slate-700/40">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 font-medium transition-colors hover:bg-slate-800/30"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-primary hover:bg-secondary text-white px-6 py-2.5 rounded-xl font-medium transition-colors duration-200 shadow-sm"
            >
              Criar Tarefa
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
