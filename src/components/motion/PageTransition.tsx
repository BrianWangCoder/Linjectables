"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE } from "./Reveal";

/** Used by app/template.tsx – every route change fades the page in. */
export default function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, ease: EASE }}>
      {children}
    </motion.div>
  );
}
