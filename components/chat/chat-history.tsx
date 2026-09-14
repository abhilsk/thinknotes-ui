"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { getAuthToken } from "@/lib/auth";

interface NoteItem {
  note_id: string;
  title: string;
  video_url: string;
  created_at: string;
}

interface ChatHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNote: (noteId: string) => void;
}

function groupByDate(notes: NoteItem[]): Record<string, NoteItem[]> {
  const groups: Record<string, NoteItem[]> = {};
  const now = new Date();
  const today = now.toDateString();
  const yesterday = new Date(now.getTime() - 86400000).toDateString();

  for (const note of notes) {
    const noteDate = new Date(note.created_at);
    const dateStr = noteDate.toDateString();

    let label: string;
    if (dateStr === today) {
      label = "Today";
    } else if (dateStr === yesterday) {
      label = "Yesterday";
    } else {
      const diffDays = Math.floor((now.getTime() - noteDate.getTime()) / 86400000);
      if (diffDays <= 7) {
        label = "Previous 7 Days";
      } else {
        label = "Older";
      }
    }

    if (!groups[label]) groups[label] = [];
    groups[label].push(note);
  }

  return groups;
}

export default function ChatHistory({ isOpen, onClose, onSelectNote }: ChatHistoryProps) {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && notes.length === 0) {
      fetchNotes();
    }
  }, [isOpen]);

  async function fetchNotes() {
    setLoading(true);
    try {
      const token = await getAuthToken();
      const response = await fetch("/api/notes", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await response.json();
      setNotes(data.notes || []);
    } catch {
      setNotes([]);
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  const grouped = groupByDate(notes);
  const groupOrder = ["Today", "Yesterday", "Previous 7 Days", "Older"];

  return (
    <div
      className="hidden md:flex flex-col overflow-hidden rounded-2xl backdrop-blur-2xl my-2"
      style={{
        height: "calc(100% - 16px)",
        width: "18rem",
        background: "var(--main-bg)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.4)",
      }}
    >
      <div className="flex items-center justify-between px-4 py-4">
        <h2 className="text-base font-semibold" style={{ color: "var(--foreground)" }}>
          Chat History
        </h2>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:opacity-70"
          style={{ color: "var(--muted)" }}
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4">
        {loading ? (
          <p className="text-sm px-2" style={{ color: "var(--muted)" }}>Loading...</p>
        ) : notes.length === 0 ? (
          <p className="text-sm px-2" style={{ color: "var(--muted)" }}>No notes yet</p>
        ) : (
          groupOrder.map((label) => {
            const items = grouped[label];
            if (!items || items.length === 0) return null;
            return (
              <div key={label} className="mb-4">
                <p
                  className="text-xs font-medium uppercase tracking-wide px-2 mb-2"
                  style={{ color: "var(--muted)" }}
                >
                  {label}
                </p>
                <div className="space-y-0.5">
                  {items.map((note) => (
                    <button
                      key={note.note_id}
                      onClick={() => onSelectNote(note.note_id)}
                      className="w-full text-left px-2 py-2 rounded-lg text-sm truncate transition-colors hover:opacity-70"
                      style={{ color: "var(--foreground)" }}
                    >
                      {note.title || "Untitled Note"}
                    </button>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
