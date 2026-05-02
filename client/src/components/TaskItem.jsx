import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Calendar, Pencil, Trash2, AlertCircle } from 'lucide-react';

function toLocalDateStr(dateVal) {
  if (!dateVal) return null;
  const d = new Date(dateVal);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatDueLabel(dateStr) {
  if (!dateStr) return null;
  const due = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  if (due.getTime() === today.getTime()) return 'Today';
  if (due.getTime() === tomorrow.getTime()) return 'Tomorrow';
  return due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function isOverdue(dateStr, done) {
  if (!dateStr || done) return false;
  const due = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return due < today;
}

export default function TaskItem({ todo, onToggle, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDesc, setEditDesc] = useState(todo.description || '');
  const [editDate, setEditDate] = useState(toLocalDateStr(todo.dueDate) || '');
  const [editError, setEditError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const dueDateStr = toLocalDateStr(todo.dueDate);
  const dueLabel = formatDueLabel(dueDateStr);
  const overdue = isOverdue(dueDateStr, todo.done);

  const handleSave = async () => {
    if (!editTitle.trim()) { setEditError('Title is required.'); return; }
    if (editTitle.trim().length < 2) { setEditError('At least 2 characters required.'); return; }
    setSaving(true);
    try {
      await onUpdate(todo._id, {
        title: editTitle.trim(),
        description: editDesc.trim(),
        dueDate: editDate || null,
      });
      setEditing(false);
      setEditError('');
    } catch {
      setEditError('Save failed. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(todo._id);
    } catch {
      setDeleting(false);
    }
  };

  const cancelEdit = () => { setEditing(false); setEditError(''); };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') cancelEdit();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: deleting ? 0 : 1, y: 0, scale: deleting ? 0.96 : 1 }}
      exit={{ opacity: 0, x: -24, scale: 0.97, transition: { duration: 0.18 } }}
      transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`glass-card overflow-hidden ${todo.done ? 'glass-card--done' : ''}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {editing ? (
          /* ── Edit mode ─────────────────────── */
          <motion.div
            key="edit"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16 }}
            className="glass-indigo px-4 py-3"
          >
            <input
              autoFocus
              type="text"
              value={editTitle}
              onChange={(e) => { setEditTitle(e.target.value); setEditError(''); }}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent text-sm font-medium text-gray-900 focus:outline-none border-b border-gray-200 pb-1.5 placeholder-gray-300"
              placeholder="Task title…"
            />

            <AnimatePresence>
              {editError && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-1 text-xs text-red-500 overflow-hidden pt-1"
                >
                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                  {editError}
                </motion.p>
              )}
            </AnimatePresence>

            <input
              type="text"
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent text-xs text-gray-500 focus:outline-none border-b border-gray-100 pb-1.5 mt-2 mb-3 placeholder-gray-300"
              placeholder="Note (optional)"
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 cursor-pointer text-gray-400">
                <Calendar className="w-3.5 h-3.5" />
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="text-xs bg-transparent focus:outline-none text-gray-500"
                />
              </label>

              <div className="flex items-center gap-3">
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={cancelEdit}
                  className="btn-ghost"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={handleSave}
                  disabled={saving}
                  className="text-xs font-semibold text-black hover:text-gray-800 disabled:opacity-50 transition-colors"
                >
                  {saving ? 'Saving…' : 'Save'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        ) : (
          /* ── View mode ─────────────────────── */
          <motion.div
            key="view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="flex items-start gap-3 px-4 py-3"
          >
            {/* Checkbox */}
            <motion.button
              whileTap={{ scale: 0.75 }}
              onClick={() => onToggle(todo._id)}
              disabled={deleting}
              aria-label={todo.done ? 'Mark incomplete' : 'Mark complete'}
              className="mt-0.5 flex-shrink-0 focus:outline-none"
            >
              <motion.span
                animate={{
                  backgroundColor: todo.done ? '#000000' : '#ffffff',
                  borderColor: todo.done ? '#000000' : '#d1d5db',
                }}
                transition={{ duration: 0.18 }}
                className="flex w-5 h-5 rounded-full border-2 items-center justify-center"
              >
                <AnimatePresence>
                  {todo.done && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                      className="flex"
                    >
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.span>
            </motion.button>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className={[
                'text-sm font-medium leading-snug transition-colors duration-200',
                todo.done ? 'line-through text-gray-400' : 'text-gray-800',
              ].join(' ')}>
                {todo.title}
              </p>

              {todo.description && (
                <p className={`text-xs mt-0.5 leading-relaxed ${todo.done ? 'text-gray-300' : 'text-gray-400'}`}>
                  {todo.description}
                </p>
              )}

              {dueLabel && (
                <span className={`mt-1.5 chip ${
                  todo.done ? 'chip-gray' : overdue ? 'chip-red' : 'chip-indigo'
                }`}>
                  <Calendar className="w-3 h-3" />
                  {overdue && !todo.done ? `Overdue · ${dueLabel}` : dueLabel}
                </span>
              )}
            </div>

            {/* Action buttons — always visible, subtle until hover */}
            <div className="flex items-center gap-0.5 flex-shrink-0">
              {!todo.done && (
                <motion.button
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.88 }}
                  onClick={() => setEditing(true)}
                  disabled={deleting}
                  aria-label="Edit task"
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-black hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.88 }}
                onClick={handleDelete}
                disabled={deleting}
                aria-label="Delete task"
                className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
