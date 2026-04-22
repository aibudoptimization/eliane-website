"use client";

import { useEffect } from "react";
import { mountSiteInteractions } from "@/lib/site-interactions";

export default function ClientScripts() {
  useEffect(() => {
    return mountSiteInteractions();
  }, []);

  return null;
}
