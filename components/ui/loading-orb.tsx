"use client";

interface LoadingOrbProps {
  size?: number;
}

export default function LoadingOrb({ size = 28 }: LoadingOrbProps) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div
        className="absolute inset-0 rounded-full animate-spin"
        style={{
          background: "conic-gradient(from 0deg, rgba(192,168,255,0.7), rgba(129,212,250,0.5), rgba(167,255,200,0.4), rgba(255,200,150,0.5), rgba(244,163,200,0.5), rgba(192,168,255,0.7))",
          animationDuration: "2s",
          filter: "blur(2px)",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          inset: "2px",
          background: "var(--surface)",
        }}
      />
    </div>
  );
}
