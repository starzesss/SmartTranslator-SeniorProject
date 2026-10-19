import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import type { BreakdownItem } from "@/hooks/useTranslationHistory";

interface BreakdownPanelProps {
  items: BreakdownItem[];
}

export default function BreakdownPanel({ items }: BreakdownPanelProps) {
  const [open, setOpen] = useState(false);

  if (!items.length) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between p-4 text-sm font-medium text-foreground hover:bg-secondary/50 transition-colors"
      >
        <span>📖 Sentence Breakdown</span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="border-t border-border p-4 space-y-3">
              {items.map((item, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl bg-secondary/50 p-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="font-medium text-sm text-foreground">{item.english}</span>
                      <span className="text-xs text-muted-foreground">→</span>
                      <span className="font-medium text-sm text-primary">{item.thai}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-[10px] rounded-full bg-primary/10 px-2 py-0.5 text-primary font-medium">{item.partOfSpeech}</span>
                      <span className="text-xs text-muted-foreground">{item.explanation}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
