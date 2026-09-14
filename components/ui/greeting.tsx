"use client";

import { useEffect, useState } from "react";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function Greeting() {
  const [greeting, setGreeting] = useState("Hello");

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h2 className="text-3xl md:text-5xl font-bold" style={{ color: "var(--foreground)" }}>
        {greeting}
      </h2>
      <p className="mt-3 text-base md:text-lg" style={{ color: "var(--muted)" }}>
        How can I help you today?
      </p>
    </div>
  );
}
