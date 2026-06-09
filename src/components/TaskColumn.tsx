import { useMemo } from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import type { Task, Status } from '../types';
import TaskCard from './TaskCard';

interface TaskColumnProps {
  id: Status;
  title: string;
  tasks: Task[];
  onDeleteTask: (id: string) => void;
}

export default function TaskColumn({ id, title, tasks, onDeleteTask }: TaskColumnProps) {
  const taskIds = useMemo(() => tasks.map((t) => t.id), [tasks]);

  const { setNodeRef } = useDroppable({
    id,
    data: {
      type: 'Column',
      id,
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold text-slate-200">{title}</h2>
        <span className="bg-slate-800 text-slate-400 text-sm font-medium py-1 px-3 rounded-full">
          {tasks.length}
        </span>
      </div>
      
      <div 
        ref={setNodeRef} 
        className="glass-panel rounded-xl p-4 min-h-[500px] flex flex-col gap-3 transition-colors duration-200"
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onDeleteTask={onDeleteTask} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
