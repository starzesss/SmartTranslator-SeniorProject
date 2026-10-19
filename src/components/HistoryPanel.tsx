import { History, Trash2, Search, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TranslationRecord } from "@/hooks/useTranslationHistory";

interface HistoryPanelProps {
  history: TranslationRecord[];
  onSelect: (record: TranslationRecord) => void;
  onClear: () => void;
}

export default function HistoryPanel({ history, onSelect, onClear }: HistoryPanelProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = history.filter(
    (r) => r.input.toLowerCase().includes(search.toLowerCase()) || r.output.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-secondary transition-all"
      >
        <History className="h-4 w-4" />
        History
        {history.length > 0 && (
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">{history.length}</span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md border-l border-border bg-background overflow-y-auto"
            >
              <div className="sticky top-0 z-10 bg-background border-b border-border p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-foreground">Translation History</h2>
                  <div className="flex gap-2">
                    {history.length > 0 && (
                      <button onClick={onClear} className="text-xs text-destructive hover:underline flex items-center gap-1">
                        <Trash2 className="h-3 w-3" /> Clear All
                      </button>
                    )}
                    <button onClick={() => setOpen(false)} className="rounded-full p-1 hover:bg-secondary">
                      <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search translations..."
                    className="w-full rounded-xl border border-border bg-secondary/50 py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div className="p-4 space-y-2">
                {filtered.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground py-10">
                    {history.length === 0 ? "No translations yet" : "No results found"}
                  </p>
                )}
                {filtered.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => { onSelect(r); setOpen(false); }}
                    className="w-full text-left rounded-xl border border-border p-3 hover:bg-secondary/50 transition-colors"
                  >
                    <p className="text-sm text-foreground truncate">{r.input}</p>
                    <p className="text-sm text-primary truncate mt-1">{r.output}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] rounded-full bg-secondary px-2 py-0.5 text-muted-foreground">{r.mode}</span>
                      <span className="text-[10px] rounded-full bg-secondary px-2 py-0.5 text-muted-foreground">{r.tone}</span>
                      <span className="text-[10px] text-muted-foreground ml-auto">
                        {new Date(r.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
