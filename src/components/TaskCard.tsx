import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Clock, GripVertical, Trash2 } from 'lucide-react';
import type { Task } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TaskCardProps {
  task: Task;
  isOverlay?: boolean;
  onDeleteTask?: (id: string) => void;
  onUpdateTask?: (task: Task) => void;
}

export default function TaskCard({ task, isOverlay, onDeleteTask, onUpdateTask }: TaskCardProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const priorityColors = {
    low: 'bg-emerald-950 text-emerald-400 border-emerald-900',
    medium: 'bg-amber-950 text-amber-400 border-amber-900',
    high: 'bg-rose-950 text-rose-400 border-rose-900',
  };

  const priorityLabels = {
    low: 'Baixa',
    medium: 'Média',
    high: 'Alta',
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="h-32 glass border-primary/50 opacity-30 rounded-xl"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`glass rounded-xl p-4 flex flex-col gap-3 group relative cursor-default hover:shadow-md hover:border-slate-700 transition-all duration-300 ${
        isOverlay ? 'scale-105 shadow-2xl z-50 cursor-grabbing border-primary' : ''
      }`}
    >
      <div className="flex justify-between items-start gap-2">
        <div className="flex flex-col gap-1">
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-md border ${
              priorityColors[task.priority]
            } w-fit`}
          >
            {priorityLabels[task.priority]}
          </span>
          <h3 className="font-semibold text-slate-100 mt-1">{task.title}</h3>
        </div>
        <div className="flex items-center gap-1">
          {onDeleteTask && (
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onDeleteTask(task.id);
              }}
              className="text-slate-500 hover:text-rose-400 transition-colors p-1"
              title="Excluir tarefa"
            >
              <Trash2 size={16} />
            </button>
          )}
          <button
            className="text-slate-500 hover:text-slate-300 transition-colors cursor-grab active:cursor-grabbing p-1"
            {...attributes}
            {...listeners}
          >
            <GripVertical size={20} />
          </button>
        </div>
      </div>

      <p className="text-sm text-slate-400 line-clamp-2">
        {task.description}
      </p>

      <div className="flex flex-col gap-1 mt-2 text-xs text-slate-400">
        {task.manager && <div><strong className="text-slate-300">Gerente:</strong> {task.manager}</div>}
        {task.client && <div><strong className="text-slate-300">Cliente:</strong> {task.client}</div>}
        {task.operationType && <div><strong className="text-slate-300">Operação:</strong> {task.operationType}</div>}
        {task.value !== undefined && <div><strong className="text-slate-300">Valor:</strong> {task.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>}
        
        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-700/50">
          <strong className="text-slate-300">Progresso:</strong>
          <button 
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); if(onUpdateTask) onUpdateTask({...task, progress: Math.max(0, (task.progress || 0) - 1)}) }}
            className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition-colors"
          >-</button>
          <span className="text-slate-200 font-medium w-4 text-center">{task.progress || 0}</span>
          <button 
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); if(onUpdateTask) onUpdateTask({...task, progress: (task.progress || 0) + 1}) }}
            className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition-colors"
          >+</button>
        </div>
      </div>

      <div className="mt-auto pt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-700/50">
        <div className="flex items-center gap-1.5">
          <Clock size={14} />
          <span>
            {formatDistanceToNow(task.createdAt, {
              addSuffix: true,
              locale: ptBR,
            })}
          </span>
        </div>
        
        {/* Mock avatar or indicator */}
        <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] text-slate-300 font-bold shadow-sm">
          TK
        </div>
      </div>
    </div>
  );
}
