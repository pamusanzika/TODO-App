import { motion, AnimatePresence } from 'framer-motion';

export default function ShowAllTasksButton({ selectedDate, onClear }) {
  return (
    <AnimatePresence>
      {selectedDate && (
        <motion.button
          key="show-all"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          whileHover={{ color: '#000000' }}
          onClick={onClear}
          className="w-full text-xs text-black font-medium py-2 rounded-xl border border-transparent hover:border-black hover:bg-gray-100 transition-colors glass"
        >
          Show all tasks
        </motion.button>
      )}
    </AnimatePresence>
  );
}
