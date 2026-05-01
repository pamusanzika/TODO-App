import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import MiniCalendar from './components/MiniCalendar';
import ShowAllTasksButton from './components/ShowAllTasksButton';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import * as api from './api/todos';

function toLocalDateStr(dateVal) {
  if (!dateVal) return null;
  const d = new Date(dateVal);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function SkeletonCard() {
  return (
    <div className="glass-card px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 rounded-full skeleton flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3 skeleton rounded-md w-2/3" />
          <div className="h-2.5 skeleton rounded-md w-1/3" />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [todos, setTodos] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    api.fetchTodos()
      .then(setTodos)
      .catch(() => setFetchError('Could not reach the server. Make sure the backend is running on port 8000.'))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = useCallback(async (data) => {
    const created = await api.createTodo(data);
    setTodos((prev) => [created, ...prev]);
  }, []);

  const handleToggle = useCallback(async (id) => {
    const toggled = await api.toggleTodoDone(id);
    setTodos((prev) => prev.map((t) => (t._id === id ? toggled : t)));
  }, []);

  const handleUpdate = useCallback(async (id, data) => {
    const updated = await api.updateTodo(id, data);
    setTodos((prev) => prev.map((t) => (t._id === id ? updated : t)));
  }, []);

  // AnimatePresence handles the exit animation — remove immediately after API call
  const handleDelete = useCallback(async (id) => {
    await api.deleteTodo(id);
    setTodos((prev) => prev.filter((t) => t._id !== id));
  }, []);

  const taskDates = useMemo(() => {
    const set = new Set();
    todos.forEach((t) => { const s = toLocalDateStr(t.dueDate); if (s) set.add(s); });
    return set;
  }, [todos]);

  const filteredTodos = useMemo(() => {
    if (!selectedDate) return todos;
    return todos.filter((t) => toLocalDateStr(t.dueDate) === selectedDate);
  }, [todos, selectedDate]);

  const totalDone = todos.filter((t) => t.done).length;
  const totalPending = todos.filter((t) => !t.done).length;
  const progress = todos.length ? Math.round((totalDone / todos.length) * 100) : 0;
  const todayStr = toLocalDateStr(new Date());

  const panelTitle = selectedDate
    ? selectedDate === todayStr
      ? "Today's Tasks"
      : new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
          weekday: 'long', month: 'long', day: 'numeric',
        })
    : 'All Tasks';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100">

      {/* ── Ambient background blobs ───────────────── */}
      <div aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -right-[15%] w-[700px] h-[700px] rounded-full bg-gray-300/30 blur-[130px]" />
        <div className="absolute -bottom-[25%] -left-[10%] w-[600px] h-[600px] rounded-full bg-violet-300/25 blur-[110px]" />
        <div className="absolute top-[45%] right-[25%]   w-[350px] h-[350px] rounded-full bg-pink-200/20   blur-[90px]"  />
      </div>

      {/* ── Header ─────────────────────────────────── */}
      <header className="sticky top-0 z-20 glass-header">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10  flex items-center justify-center ">
              <img src="/assets/To_do_logo.svg" alt="Tasky" className="w-10 h-10" />
            </div>
            <span className="font-semibold text-gray-900 tracking-tight">Tasky</span>
          </div>

          <div className="flex items-center gap-3">
            <AnimatePresence>
              {totalPending > 0 && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-xs font-semibold text-black bg-gray-100 px-2.5 py-1 rounded-full"
                >
                  {totalPending} pending
                </motion.span>
              )}
            </AnimatePresence>
            <span className="hidden sm:block text-xs text-gray-400">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long', month: 'long', day: 'numeric',
              })}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">

        {/* Fetch error */}
        <AnimatePresence>
          {fetchError && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.22 }}
              className="mb-5 overflow-hidden"
            >
              <div className="flex items-start gap-3 px-4 py-3.5 rounded-2xl text-sm text-red-700" style={{ background: 'rgba(254,242,242,0.75)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(254,202,202,0.5)' }}>
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{fetchError}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col lg:flex-row gap-5 items-start">

          {/* ── Sidebar ────────────────────────────── */}
          <aside className="w-full lg:w-60 flex-shrink-0 space-y-4 lg:sticky lg:top-20">
            <MiniCalendar
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              taskDates={taskDates}
            />
            <ShowAllTasksButton
              selectedDate={selectedDate}
              onClear={() => setSelectedDate(null)}
            />

            {/* Stats */}
            <div className="glass rounded-2xl p-4">
              <p className="section-label mb-3">Overview</p>

              <div className="space-y-2.5 mb-3">
                {[
                  { label: 'Total', value: todos.length, color: 'text-gray-700' },
                  { label: 'Completed', value: totalDone, color: 'text-emerald-600' },
                  { label: 'Pending', value: totalPending, color: 'text-red-600' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">{label}</span>
                    <motion.span
                      key={value}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`text-xs font-semibold tabular-nums ${color}`}
                    >
                      {value}
                    </motion.span>
                  </div>
                ))}
              </div>

              {todos.length > 0 && (
                <div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-gray-600 to-gray-700 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                  </div>
                  <p className="text-xs text-gray-300 mt-1.5 text-right tabular-nums">
                    {progress}% done
                  </p>
                </div>
              )}
            </div>
          </aside>

          {/* ── Main panel ─────────────────────────── */}
          <div className="flex-1 min-w-0 space-y-4">
            <TaskForm onAdd={handleAdd} defaultDate={selectedDate || ''} />

            {/* Panel header */}
            <div className="flex items-center justify-between px-1 pt-1">
              <h2 className="text-sm font-semibold text-gray-700">{panelTitle}</h2>
              {!loading && filteredTodos.length > 0 && (
                <span className="text-xs text-gray-400 tabular-nums">
                  {filteredTodos.length} task{filteredTodos.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-1.5"
              >
                {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
              </motion.div>
            ) : (
              <TaskList
                todos={filteredTodos}
                selectedDate={selectedDate}
                onToggle={handleToggle}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
