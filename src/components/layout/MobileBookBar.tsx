"use client";

import { motion } from "framer-motion";
import BookButton from "@/components/booking/BookButton";
import { EASE } from "@/components/motion/Reveal";
import { useI18n } from "@/components/i18n/I18nProvider";

/** Persistent "Book Online" pill, mobile & tablet only. */
export default function MobileBookBar() {
  const { t } = useI18n();
  return (
    <motion.div
      className="fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 lg:hidden"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: EASE, delay: 1.2 }}
    >
      <BookButton label={t.nav.bookOnline} className="w-full shadow-[0_10px_30px_rgba(0,0,0,0.25)]" />
    </motion.div>
  );
}
