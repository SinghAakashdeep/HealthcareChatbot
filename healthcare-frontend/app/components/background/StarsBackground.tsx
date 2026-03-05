"use client";

import { usePathname } from "next/navigation";

export default function StarsBackground() {
  const pathname = usePathname();

  if (pathname.startsWith("/doctor") || pathname.startsWith("/patient")) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
      }}
    >
      <div id="stars" />
      <div id="stars2" />
      <div id="stars3" />
    </div>
  );
}
