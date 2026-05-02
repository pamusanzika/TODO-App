import { AnimatePresence, motion } from 'framer-motion';
import { ClipboardList } from 'lucide-react';
import TaskItem from './TaskItem';

function EmptyState({ filtered }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-14 text-center"
    >
      <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
        <ClipboardList className="w-7 h-7 text-gray-300" />
      </div>
      <p className="text-sm font-medium text-gray-400">
        {filtered ? 'No tasks for this date' : 'No tasks yet'}
      </p>
      <p className="text-xs text-gray-300 mt-1">
        {filtered ? 'Try another date or add a new task' : 'Add your first task above'}
      </p>
    </motion.div>
  );
}

export default function TaskList({ todos, selectedDate, onToggle, onUpdate, onDelete }) {
  if (todos.length === 0) return <EmptyState filtered={!!selectedDate} />;

  const pending = todos.filter((t) => !t.done);
  const done = todos.filter((t) => t.done);

  return (
    <div className="space-y-1.5">
      {/* Pending tasks */}
      <AnimatePresence initial={false}>
        {pending.map((todo) => (
          <div key={todo._id} className="group">
            <TaskItem
              todo={todo}
              onToggle={onToggle}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          </div>
        ))}
      </AnimatePresence>

      {/* Completed section */}
      <AnimatePresence>
        {done.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {pending.length > 0 && (
              <div className="flex items-center gap-2 pt-2 pb-1">
                <div className="flex-1 border-t border-gray-100" />
                <span className="text-xs text-gray-300 font-medium">
                  Completed · {done.length}
                </span>
                <div className="flex-1 border-t border-gray-100" />
              </div>
            )}

            <div className="space-y-1.5">
              <AnimatePresence initial={false}>
                {done.map((todo) => (
                  <div key={todo._id} className="group">
                    <TaskItem
                      todo={todo}
                      onToggle={onToggle}
                      onUpdate={onUpdate}
                      onDelete={onDelete}
                    />
                  </div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
