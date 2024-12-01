"use client";

import { useEffect, useState } from "react";

export function useScrollHeight() {
  const [scrollHeight, setScrollHeight] = useState(0);

  const updateHeight = () => {
    setScrollHeight(window.scrollY);
  };

  useEffect(() => {
    if (!window) return;

    window.addEventListener("scroll", updateHeight);
    return () => window.removeEventListener("scroll", updateHeight);
  }, []);

  return scrollHeight;
}
