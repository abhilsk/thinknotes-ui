"use client";

import { Plus, Mic, ArrowUp } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled: boolean;
}

export default function ChatInput({
  value,
  onChange,
  onSubmit,
  disabled,
}: ChatInputProps) {
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div
        className="relative flex items-center rounded-2xl px-4 py-3 shadow-sm"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
        }}
      >
        <div className="flex items-center gap-2 mr-3">
          <button
            type="button"
            className="p-1.5 rounded-lg transition-colors hover:opacity-70"
            style={{ color: "var(--muted)" }}
          >
            <Plus size={18} />
          </button>
          <button
            type="button"
            className="p-1.5 rounded-lg transition-colors hover:opacity-70"
            style={{ color: "var(--muted)" }}
          >
            <Mic size={18} />
          </button>
        </div>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Paste a YouTube URL..."
          disabled={disabled}
          className="flex-1 bg-transparent text-sm outline-none disabled:opacity-50"
          style={{ color: "var(--foreground)" }}
        />

        <button
          type="button"
          onClick={onSubmit}
          disabled={disabled || !value.trim()}
          className="ml-3 p-2 rounded-full text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          style={{ background: "var(--accent)" }}
        >
          <ArrowUp size={16} />
        </button>
      </div>
    </div>
  );
}