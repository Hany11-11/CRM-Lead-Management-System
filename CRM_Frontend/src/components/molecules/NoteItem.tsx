import { motion } from "framer-motion";
import { Avatar } from "../atoms/Avatar";
import { Typography } from "../atoms/Typography";
import { formatRelativeDateWithTime } from "../../utils/helpers";
import type { Note } from "../../types";

interface NoteItemProps {
  note: Note;
  onDelete?: (noteId: string) => void;
}

export const NoteItem = ({ note, onDelete }: NoteItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ type: "spring", damping: 25 }}
      whileHover={{ backgroundColor: "rgba(15, 23, 42, 0.02)" }}
      className="flex gap-3 py-4 border-b border-slate-100 last:border-b-0 group"
    >
      <Avatar name={note.author} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Typography variant="h4">{note.author}</Typography>
          <Typography variant="caption">
            {formatRelativeDateWithTime(note.createdAt)}
          </Typography>
        </div>
        <Typography variant="body" className="text-slate-700">
          {note.content}
        </Typography>
      </div>
      {onDelete && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          whileHover={{ opacity: 1, scale: 1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onDelete(note.id)}
          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all duration-200 p-1"
          aria-label="Delete note"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </motion.button>
      )}
    </motion.div>
  );
};
