"use client";

import { useEffect } from "react";
import { initIntroPhotoDock } from "@/lib/intro-photo-dock";

export default function IntroPhotoDock() {
  useEffect(() => {
    return initIntroPhotoDock();
  }, []);

  return null;
}
