"use client";

import { useEffect, useState } from "react";

export default function AiBubble() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  if (isDark) {
    return (
      <div className="w-28 h-28 md:w-36 md:h-36 relative">
        <div
          className="absolute inset-0 rounded-full animate-spin"
          style={{
            background: "conic-gradient(from 0deg, rgba(100,50,180,0.7), rgba(50,100,200,0.5), rgba(50,180,100,0.4), rgba(200,120,50,0.5), rgba(180,50,100,0.5), rgba(100,50,180,0.7))",
            animationDuration: "6s",
            filter: "blur(6px)",
          }}
        />
        <div
          className="absolute inset-1 rounded-full"
          style={{
            background: "radial-gradient(circle at 40% 35%, rgba(80,140,220,0.3) 0%, rgba(50,180,120,0.2) 30%, rgba(10,15,30,0.95) 70%)",
            boxShadow: "0 0 40px rgba(100,50,180,0.4), 0 0 80px rgba(50,100,200,0.15), inset 0 0 30px rgba(80,140,220,0.2)",
          }}
        />
        <div
          className="absolute inset-3 rounded-full animate-pulse"
          style={{
            background: "radial-gradient(circle at 35% 30%, rgba(80,140,220,0.25) 0%, transparent 50%), radial-gradient(circle at 65% 65%, rgba(50,180,120,0.2) 0%, transparent 40%), radial-gradient(circle at 50% 50%, rgba(200,120,50,0.15) 0%, transparent 45%)",
            animationDuration: "3s",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            top: "15%",
            left: "20%",
            width: "30%",
            height: "20%",
            background: "radial-gradient(ellipse at center, rgba(255,255,255,0.15) 0%, transparent 70%)",
            transform: "rotate(-15deg)",
          }}
        />
      </div>
    );
  }

  return (
    <div className="w-28 h-28 md:w-36 md:h-36 relative">
      <div
        className="absolute inset-0 rounded-full animate-spin"
        style={{
          background: "conic-gradient(from 0deg, rgba(192,168,255,0.7), rgba(129,212,250,0.5), rgba(167,255,200,0.4), rgba(255,200,150,0.5), rgba(244,163,200,0.5), rgba(192,168,255,0.7))",
          animationDuration: "6s",
          filter: "blur(6px)",
        }}
      />
      <div
        className="absolute inset-1 rounded-full"
        style={{
          background: "radial-gradient(circle at 40% 35%, rgba(255,255,255,0.7) 0%, rgba(192,168,255,0.4) 40%, rgba(240,240,255,0.9) 70%)",
          boxShadow: "0 20px 60px rgba(167,139,250,0.3), 0 8px 20px rgba(129,140,248,0.2), inset 0 -8px 20px rgba(244,114,182,0.2), inset 0 8px 20px rgba(255,255,255,0.6)",
        }}
      />
      <div
        className="absolute inset-3 rounded-full animate-pulse"
        style={{
          background: "radial-gradient(circle at 35% 30%, rgba(129,140,248,0.3) 0%, transparent 50%), radial-gradient(circle at 65% 65%, rgba(244,114,182,0.25) 0%, transparent 40%), radial-gradient(circle at 50% 50%, rgba(129,212,250,0.2) 0%, transparent 45%)",
          animationDuration: "3s",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          top: "12%",
          left: "18%",
          width: "35%",
          height: "25%",
          background: "radial-gradient(ellipse at center, rgba(255,255,255,0.7) 0%, transparent 70%)",
          transform: "rotate(-20deg)",
        }}
      />
    </div>
  );
}
