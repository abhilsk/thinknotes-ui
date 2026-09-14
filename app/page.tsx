"use client";

import { useState, useRef, useEffect } from "react";
import { PanelLeft, SquarePen } from "lucide-react";
import Sidebar from "@/components/chat/sidebar";
import Greeting from "@/components/ui/greeting";
import AiBubble from "@/components/ui/ai-bubble";
import ChatInput from "@/components/ui/chat-input";
import RecentChats from "@/components/chat/recent-chats";
import ChatHistory from "@/components/chat/chat-history";
import LoadingOrb from "@/components/ui/loading-orb";
import { getAuthToken } from "@/lib/auth";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  loading?: boolean;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSubmit() {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "",
      loading: true,
    };

    setMessages((prev) => [...prev, userMessage, loadingMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const token = await getAuthToken();
      const response = await fetch("/api/generate-notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ video_url: userMessage.content }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content: response.ok
          ? data.notes || data.error || "No notes generated."
          : `Error: ${data.error || "Something went wrong."}`,
      };

      setMessages((prev) =>
        prev.filter((m) => !m.loading).concat(assistantMessage)
      );
    } catch {
      setMessages((prev) =>
        prev.filter((m) => !m.loading).concat({
          id: (Date.now() + 2).toString(),
          role: "assistant",
          content: "Error: Failed to connect to the server.",
        })
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSelectNote(noteId: string) {
    setIsLoading(true);
    setMessages([{
      id: Date.now().toString(),
      role: "assistant",
      content: "",
      loading: true,
    }]);

    try {
      const token = await getAuthToken();
      const response = await fetch(`/api/notes/${noteId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await response.json();

      if (response.ok) {
        const userMsg: Message = {
          id: Date.now().toString(),
          role: "user",
          content: data.video_url || data.title || "Loaded note",
        };
        const assistantMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.notes || "No content available.",
        };
        setMessages([userMsg, assistantMsg]);
      } else {
        setMessages([{
          id: Date.now().toString(),
          role: "assistant",
          content: "Error: Failed to load note.",
        }]);
      }
    } catch {
      setMessages([{
        id: Date.now().toString(),
        role: "assistant",
        content: "Error: Failed to load note.",
      }]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleNewChat() {
    setMessages([]);
    setInput("");
  }

  const hasMessages = messages.length > 0;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onAllChats={() => setHistoryOpen(!historyOpen)}
        onNewChat={handleNewChat}
        onSelectNote={handleSelectNote}
      />

      <div className="flex-1 flex gap-2 h-full">
        <ChatHistory
          isOpen={historyOpen}
          onClose={() => setHistoryOpen(false)}
          onSelectNote={handleSelectNote}
        />

        <div className="flex-1 md:py-2 md:pr-2 h-full">
          <main
            className="flex flex-col h-full rounded-2xl backdrop-blur-2xl overflow-hidden"
            style={{
              background: "var(--main-bg)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.4)",
            }}
          >
            <header className="flex items-center justify-between px-4 py-3 md:hidden">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg hover:opacity-70"
                style={{ color: "var(--foreground)" }}
              >
                <PanelLeft size={22} />
              </button>
              <button
                onClick={handleNewChat}
                className="p-2 rounded-lg hover:opacity-70"
                style={{ color: "var(--foreground)" }}
              >
                <SquarePen size={20} />
              </button>
            </header>

            {hasMessages ? (
              <div className="flex-1 overflow-y-auto px-4 py-6">
                <div className="max-w-4xl mx-auto space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className="max-w-[85%] rounded-2xl px-4 py-3"
                        style={
                          message.role === "user"
                            ? { background: "var(--accent)", color: "#ffffff" }
                            : { background: "var(--surface)", border: "1px solid var(--border)", color: "var(--foreground)" }
                        }
                      >
                        {message.loading ? (
                          <LoadingOrb size={24} />
                        ) : (
                          <div className="whitespace-pre-wrap text-sm leading-relaxed">
                            {message.content}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center gap-6 px-4">
                <AiBubble />
                <Greeting />
              </div>
            )}

            <footer className="px-4 py-4 space-y-4">
              <ChatInput
                value={input}
                onChange={setInput}
                onSubmit={handleSubmit}
                disabled={isLoading}
              />
              {!hasMessages && (
                <div className="pb-2">
                  <RecentChats onSelectNote={handleSelectNote} />
                </div>
              )}
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}
