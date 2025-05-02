import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppLayout } from '../layouts/AppLayout';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  color?: string;
}

interface NotesAppProps {
  onBack: () => void;
}

const NOTE_COLORS = [
  'from-yellow-400 to-yellow-500',
  'from-blue-400 to-blue-500',
  'from-purple-400 to-purple-500',
  'from-pink-400 to-pink-500',
  'from-green-400 to-green-500'
];

export function NotesApp({ onBack }: NotesAppProps) {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Welcome to Notes',
      content: 'This is your first note. Tap the + button to create more notes.',
      createdAt: new Date(),
      updatedAt: new Date(),
      color: NOTE_COLORS[0]
    }
  ]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const handleCreateNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'New Note',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      color: NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)]
    };
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
  };

  return (
    <AppLayout
      title={selectedNote ? selectedNote.title : 'Notes'}
      onBack={selectedNote ? () => setSelectedNote(null) : onBack}
      rightAction={
        !selectedNote && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleCreateNote}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <svg
              className="w-5 h-5 text-white/80"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </motion.button>
        )
      }
    >
      <AnimatePresence mode="wait">
        {selectedNote ? (
          <motion.div
            key="note-editor"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 h-full"
          >
            <div className={cn(
              "absolute inset-0 bg-gradient-to-br",
              selectedNote.color || NOTE_COLORS[0],
              "opacity-10"
            )} />
            <textarea
              value={selectedNote.content}
              onChange={(e) => {
                const updatedNote = {
                  ...selectedNote,
                  content: e.target.value,
                  updatedAt: new Date()
                };
                setSelectedNote(updatedNote);
                setNotes(notes.map(n => n.id === updatedNote.id ? updatedNote : n));
              }}
              placeholder="Start typing..."
              className="w-full h-full bg-transparent text-white/90 resize-none focus:outline-none"
            />
          </motion.div>
        ) : (
          <motion.div
            key="notes-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="divide-y divide-white/10"
          >
            {notes.map(note => (
              <motion.button
                key={note.id}
                onClick={() => setSelectedNote(note)}
                className="w-full p-4 text-left hover:bg-white/5 transition-colors group"
                whileHover={{ x: 4 }}
              >
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-br",
                  note.color || NOTE_COLORS[0],
                  "opacity-10 group-hover:opacity-20 transition-opacity"
                )} />
                <div className="relative">
                  <h3 className="text-white/90 font-medium drop-shadow-[0_0_2px_rgba(255,255,255,0.3)]">
                    {note.title}
                  </h3>
                  <p className="text-sm text-white/60 mt-1 line-clamp-2">
                    {note.content || 'No content'}
                  </p>
                  <p className="text-xs text-white/40 mt-2">
                    {format(note.updatedAt, 'MMM d, yyyy')}
                  </p>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
} 