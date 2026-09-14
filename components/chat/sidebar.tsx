"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "aws-amplify/auth";
import { useAuth } from "@/hooks/use-auth";
import { getAuthToken } from "@/lib/auth";
import {
  MessageSquarePlus,
  Search,
  MessageSquare,
  Folder,
  Settings,
  X,
  ChevronDown,
  ChevronUp,
  LogOut,
} from "lucide-react";
import ThemeToggle from "@/components/ui/theme-toggle";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onAllChats: () => void;
  onNewChat: () => void;
  onSelectNote?: (noteId: string) => void;
}

interface NoteItem {
  note_id: string;
  title: string;
  created_at: string;
}

function groupNotesByDate(notes: NoteItem[]): { label: string; items: NoteItem[] }[] {
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
      label = diffDays <= 7 ? "Previous 7 Days" : "Older";
    }

    if (!groups[label]) groups[label] = [];
    groups[label].push(note);
  }

  const order = ["Today", "Yesterday", "Previous 7 Days", "Older"];
  return order.filter((l) => groups[l]).map((l) => ({ label: l, items: groups[l] }));
}

export default function Sidebar({ isOpen, onClose, onAllChats, onNewChat, onSelectNote }: SidebarProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [mobileChatsOpen, setMobileChatsOpen] = useState(false);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(false);

  useEffect(() => {
    if (mobileChatsOpen && notes.length === 0) {
      setLoadingNotes(true);
      getAuthToken()
        .then((token) =>
          fetch("/api/notes", { headers: token ? { Authorization: `Bearer ${token}` } : {} })
        )
        .then((res) => res.json())
        .then((data) => setNotes(data.notes || []))
        .catch(() => setNotes([]))
        .finally(() => setLoadingNotes(false));
    }
  }, [mobileChatsOpen]);

  function handleAllChatsClick() {
    onAllChats();
    setMobileChatsOpen(!mobileChatsOpen);
  }

  const navItems = [
    { icon: Search, label: "Search Chat", onClick: () => {} },
    { icon: MessageSquare, label: "All Chats", onClick: handleAllChatsClick, hasDropdown: true },
    { icon: Folder, label: "Folders", onClick: () => {} },
    { icon: Settings, label: "Settings", onClick: () => {} },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-64 z-50 flex flex-col
          transition-transform duration-200 ease-in-out
          md:static md:translate-x-0 md:w-1/4 md:min-w-56 md:max-w-72
          ${isOpen ? "translate-x-0 backdrop-blur-xl" : "-translate-x-full"}
        `}
        style={{
          background: "var(--sidebar-fade)",
        }}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <h1 className="text-xl font-semibold tracking-tight" style={{ color: "var(--foreground)" }}>
            Abigail
          </h1>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button
              onClick={onClose}
              className="md:hidden p-1 rounded-lg hover:opacity-70"
              style={{ color: "var(--foreground)" }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="px-4 mt-12 mb-4">
          <button
            onClick={onNewChat}
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-medium rounded-xl transition-colors"
            style={{
              border: "1px solid var(--border)",
              color: "var(--foreground)",
              background: "var(--surface-solid)",
            }}
          >
            <MessageSquarePlus size={16} />
            <span>New Chat</span>
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <div key={item.label}>
              <button
                onClick={item.onClick}
                className="flex items-center gap-3 w-full px-3 py-2.5 text-sm rounded-lg transition-colors hover:opacity-70"
                style={{ color: "var(--sidebar-text)" }}
              >
                <item.icon size={18} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.hasDropdown && (
                  <span className="md:hidden">
                    {mobileChatsOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </span>
                )}
              </button>

              {item.hasDropdown && mobileChatsOpen && (
                <div className="md:hidden max-h-56 overflow-y-auto ml-6 mt-1 mb-2">
                  {loadingNotes ? (
                    <p className="text-xs px-2 py-1" style={{ color: "var(--muted)" }}>Loading...</p>
                  ) : notes.length === 0 ? (
                    <p className="text-xs px-2 py-1" style={{ color: "var(--muted)" }}>No notes yet</p>
                  ) : (
                    groupNotesByDate(notes).map(({ label, items }) => (
                      <div key={label} className="mb-2">
                        <p
                          className="text-[10px] font-medium uppercase tracking-wide px-2 mb-1"
                          style={{ color: "var(--muted)" }}
                        >
                          {label}
                        </p>
                        <div className="space-y-0.5">
                          {items.map((note) => (
                            <button
                              key={note.note_id}
                              onClick={() => {
                                onSelectNote?.(note.note_id);
                                onClose();
                              }}
                              className="w-full text-left px-2 py-1.5 rounded-lg text-xs truncate transition-colors hover:opacity-70"
                              style={{ color: "var(--sidebar-text)" }}
                            >
                              {note.title || "Untitled Note"}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="px-4 py-4">
          <div
            className="flex items-center gap-3 w-full px-3 py-2 rounded-xl"
            style={{
              background: "var(--surface-solid)",
              border: "1px solid var(--border)",
            }}
          >
            <button
              onClick={() => !user && router.push("/login")}
              className="flex items-center gap-3 flex-1 min-w-0"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white shrink-0"
                style={{ background: user ? "#f97316" : "#94a3b8" }}
              >
                {user?.email?.[0]?.toUpperCase() || "?"}
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: "var(--foreground)" }}>
                  {user ? (user.email || "User") : "Sign In"}
                </p>
                <p className="text-xs" style={{ color: "var(--muted)" }}>
                  {user ? "Free Plan" : "Click to sign in"}
                </p>
              </div>
            </button>
            {user && (
              <button
                onClick={async () => {
                  await signOut();
                  window.location.reload();
                }}
                title="Sign out"
                className="p-1.5 rounded-lg hover:opacity-70 shrink-0"
                style={{ color: "var(--muted)" }}
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
