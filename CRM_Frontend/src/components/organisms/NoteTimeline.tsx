import { useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import type { Note } from "../../types";
import { NoteItem } from "../molecules/NoteItem";
import { Button } from "../atoms/Button";
import { Typography } from "../atoms/Typography";

interface NoteTimelineProps {
  notes: Note[];
  onAddNote: (content: string) => void;
  onDeleteNote?: (noteId: string) => void;
}

export const NoteTimeline = ({
  notes,
  onAddNote,
  onDeleteNote,
}: NoteTimelineProps) => {
  const [newNote, setNewNote] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    onAddNote(newNote.trim());
    setNewNote("");
  };

  const sortedNotes = [...notes].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a note..."
            rows={2}
            className="w-full px-4 py-3 text-sm text-slate-900 bg-white border border-slate-300 rounded-xl
              placeholder:text-slate-400 resize-none
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
              hover:border-slate-400 transition-all"
          />
        </div>
        <div className="flex gap-2 sm:flex-col">
          <Button
            type="submit"
            disabled={!newNote.trim()}
            size="lg"
            fullWidth
            className="h-full sm:h-auto whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add</span>
          </Button>
        </div>
      </form>

      <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
        {sortedNotes.length === 0 ? (
          <div className="py-8 text-center">
            <Typography variant="body" className="text-slate-400">
              No notes yet. Add the first one above.
            </Typography>
          </div>
        ) : (
          sortedNotes.map((note) => (
            <div key={note.id} className="px-4">
              <NoteItem note={note} onDelete={onDeleteNote} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};
