"use client";

import { useEffect } from "react";
import { mountSiteInteractions } from "@/lib/site-interactions";

export default function ClientScripts() {
  useEffect(() => {
    let teardown: (() => void) | undefined;
    const rafId = requestAnimationFrame(() => {
      teardown = mountSiteInteractions();
    });
    return () => {
      cancelAnimationFrame(rafId);
      teardown?.();
    };
  }, []);

  return null;
}
