"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { mountSiteInteractions } from "@/lib/site-interactions";

export default function ClientScripts() {
  const pathname = usePathname();
  useEffect(() => {
    let teardown: (() => void) | undefined;
    const rafId = requestAnimationFrame(() => {
      teardown = mountSiteInteractions();
    });
    return () => {
      cancelAnimationFrame(rafId);
      teardown?.();
    };
  }, [pathname]);

  return null;
}
