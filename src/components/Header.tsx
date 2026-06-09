import { Plus, Trash2, Download, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Task } from '../types';

interface HeaderProps {
  tasks?: Task[];
  onAddTaskClick: () => void;
  onClearTasks: () => void;
}

export default function Header({ tasks, onAddTaskClick, onClearTasks }: HeaderProps) {
  const statusMap: Record<string, string> = {
    'todo': 'A Fazer',
    'in-progress': 'Em Progresso',
    'done': 'Concluído'
  };

  const priorityMap: Record<string, string> = {
    'low': 'Baixa',
    'medium': 'Média',
    'high': 'Alta'
  };

  const handleExportCSV = () => {
    if (!tasks || tasks.length === 0) return;

    const headers = ['ID', 'Título', 'Status', 'Prioridade', 'Gerente', 'Cliente', 'Tipo de Operação', 'Valor'];
    const rows = tasks.map(t => [
      t.id,
      `"${t.title.replace(/"/g, '""')}"`,
      statusMap[t.status] || t.status,
      priorityMap[t.priority] || t.priority,
      `"${t.manager}"`,
      `"${t.client}"`,
      `"${t.operationType}"`,
      t.value || 0
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'tarefas.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    if (!tasks || tasks.length === 0) return;

    const doc = new jsPDF();
    doc.text('Relatório de Tarefas', 14, 15);

    const tableData = tasks.map(t => [
      t.title,
      statusMap[t.status] || t.status,
      priorityMap[t.priority] || t.priority,
      t.manager,
      t.client,
      t.operationType,
      t.value ? `R$ ${t.value.toFixed(2)}` : '-'
    ]);

    autoTable(doc, {
      head: [['Título', 'Status', 'Prioridade', 'Gerente', 'Cliente', 'Operação', 'Valor']],
      body: tableData,
      startY: 20,
    });

    doc.save('tarefas.pdf');
  };

  return (
    <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="rounded-xl overflow-hidden flex items-center justify-center">
            <img src="/gerenciador-tarefas-Mayara/icon.png" alt="Ícone" className="h-12 w-auto object-contain" />
          </div>
          <h1 className="text-3xl font-bold text-slate-100">
            Mayara Lourençoni Quatrochi
          </h1>
        </div>
        <p className="text-slate-400">Gerenciador de tarefas</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleExportCSV}
          className="flex items-center justify-center gap-2 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 border border-slate-700/50 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-sm"
          title="Exportar para CSV"
        >
          <FileText size={20} />
          <span className="hidden sm:inline">CSV</span>
        </button>
        <button
          onClick={handleExportPDF}
          className="flex items-center justify-center gap-2 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 border border-slate-700/50 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-sm"
          title="Exportar para PDF"
        >
          <Download size={20} />
          <span className="hidden sm:inline">PDF</span>
        </button>
        <button
          onClick={onClearTasks}
          className="flex items-center justify-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 hover:border-rose-500/40 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-sm"
        >
          <Trash2 size={20} />
          <span className="hidden sm:inline">Limpar</span>
        </button>
        <button
          onClick={onAddTaskClick}
          className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/80 text-slate-900 px-5 py-2.5 rounded-xl font-semibold transition-colors duration-200 shadow-sm"
        >
          <Plus size={20} />
          Nova Tarefa
        </button>
      </div>
    </header>
  );
}
