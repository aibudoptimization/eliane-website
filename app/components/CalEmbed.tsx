"use client";

import { useEffect } from "react";
import { initCalEmbed } from "@/lib/cal-embed-init";

export default function CalEmbed() {
  useEffect(() => {
    initCalEmbed();
  }, []);

  return null;
}
