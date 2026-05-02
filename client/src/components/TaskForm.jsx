import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, AlertCircle, Loader2, Plus } from 'lucide-react';

export default function TaskForm({ onAdd, defaultDate }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(defaultDate || '');
  const [errors, setErrors] = useState({});
  const [adding, setAdding] = useState(false);
  const [shaking, setShaking] = useState(false);
  const titleRef = useRef(null);

  const validate = () => {
    const errs = {};
    if (!title.trim()) errs.title = 'Task title is required.';
    else if (title.trim().length < 2) errs.title = 'Title must be at least 2 characters.';
    return errs;
  };

  const triggerShake = () => {
    setShaking(true);
    setTimeout(() => setShaking(false), 450);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      triggerShake();
      titleRef.current?.focus();
      return;
    }
    setAdding(true);
    try {
      await onAdd({ title: title.trim(), description: description.trim(), dueDate: dueDate || null });
      setTitle('');
      setDescription('');
      setDueDate(defaultDate || '');
      setErrors({});
    } catch {
      setErrors({ form: 'Could not add task — is the server running?' });
    } finally {
      setAdding(false);
    }
  };

  const clearError = (field) =>
    setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });

  return (
    <motion.form
      onSubmit={handleSubmit}
      animate={shaking ? { x: [-6, 6, -5, 5, -3, 3, 0] } : { x: 0 }}
      transition={shaking ? { duration: 0.42, ease: 'easeInOut' } : {}}
      className="glass rounded-2xl px-5 py-4"
      noValidate
    >
      <p className="section-label mb-4">New Task</p>

      {/* Global error */}
      <AnimatePresence>
        {errors.form && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 12 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-red-600" style={{ background: 'rgba(254,242,242,0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(254,202,202,0.45)' }}>
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              {errors.form}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Title */}
      <div className="mb-3">
        <input
          ref={titleRef}
          type="text"
          placeholder="What do you need to do?"
          value={title}
          onChange={(e) => { setTitle(e.target.value); clearError('title'); }}
          className={`input-base text-base font-medium text-gray-900 border-b pb-2 ${
            errors.title ? 'border-red-300' : 'border-gray-100 focus:border-gray-300'
          }`}
        />
        <AnimatePresence>
          {errors.title && (
            <motion.p
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 6 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.18 }}
              className="text-xs text-red-500 flex items-center gap-1 overflow-hidden"
            >
              <AlertCircle className="w-3 h-3 flex-shrink-0" />
              {errors.title}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Description */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Add a note (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input-base text-sm text-gray-600 border-b border-gray-100 focus:border-gray-200 pb-2"
        />
      </div>

      {/* Footer */}
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-1.5 flex-1 cursor-pointer group">
          <Calendar className="w-4 h-4 text-gray-300 group-hover:text-gray-600 transition-colors" />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="text-xs text-gray-400 bg-transparent focus:outline-none focus:text-black cursor-pointer"
          />
        </label>

        <motion.button
          type="submit"
          disabled={adding}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          className="btn-primary flex items-center gap-1.5"
        >
          {adding ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Adding…
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              Add Task
            </>
          )}
        </motion.button>
      </div>
    </motion.form>
  );
}
