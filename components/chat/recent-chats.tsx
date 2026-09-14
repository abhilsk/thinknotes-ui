"use client";

import { useEffect, useState } from "react";
import { getAuthToken } from "@/lib/auth";

interface NoteItem {
  note_id: string;
  title: string;
  created_at: string;
}

interface RecentChatsProps {
  onSelectNote: (noteId: string) => void;
}

export default function RecentChats({ onSelectNote }: RecentChatsProps) {
  const [notes, setNotes] = useState<NoteItem[]>([]);

  useEffect(() => {
    (async () => {
      const token = await getAuthToken();
      if (!token) return;
      try {
        const res = await fetch("/api/notes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setNotes((data.notes || []).slice(0, 5));
      } catch {
        setNotes([]);
      }
    })();
  }, []);

  if (notes.length === 0) return null;

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <p className="text-sm mb-3" style={{ color: "var(--muted)" }}>
        Your recent chats
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {notes.map((note) => (
          <button
            key={note.note_id}
            onClick={() => onSelectNote(note.note_id)}
            className="text-left p-4 rounded-xl transition-colors hover:opacity-90"
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
            }}
          >
            <p className="text-sm font-medium truncate" style={{ color: "var(--foreground)" }}>
              {note.title || "Untitled Note"}
            </p>
            <p className="text-xs mt-2" style={{ color: "var(--muted)" }}>
              {formatDate(note.created_at)}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
