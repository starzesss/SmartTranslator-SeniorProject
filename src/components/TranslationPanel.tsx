import { Copy, Check, Loader2, ArrowRight, Eraser, SpellCheck } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TranslationPanelProps {
  input: string;
  onInputChange: (v: string) => void;
  output: string;
  correctedEnglish?: string;
  isLoading: boolean;
  onTranslate: () => void;
  onClear: () => void;
  grammarFix: boolean;
  onGrammarFixChange: (v: boolean) => void;
}

export default function TranslationPanel({
  input,
  onInputChange,
  output,
  correctedEnglish,
  isLoading,
  onTranslate,
  onClear,
  grammarFix,
  onGrammarFixChange,
}: TranslationPanelProps) {
  const [copied, setCopied] = useState(false);
  const charCount = input.length;
  const wordCount = input.trim().split(/\s+/).filter(Boolean).length;

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      onTranslate();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="flex flex-col gap-4"
    >
      {/* Grammar Fix Toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onGrammarFixChange(!grammarFix)}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-all",
            grammarFix
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <SpellCheck className="h-4 w-4" />
          Grammar Fix
          <span className={cn(
            "text-[10px] rounded-full px-1.5 py-0.5 font-medium",
            grammarFix ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
          )}>
            {grammarFix ? "ON" : "OFF"}
          </span>
        </button>
      </div>

      {/* Translation Panels */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Input */}
        <div className="glass rounded-2xl p-4 flex flex-col min-h-[200px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">English</span>
            <span className="text-xs text-muted-foreground">{charCount} chars · {wordCount} words</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter English text..."
            className="flex-1 resize-none bg-transparent text-foreground text-sm leading-relaxed placeholder:text-muted-foreground/50 focus:outline-none"
          />
        </div>

        {/* Output */}
        <div className="glass rounded-2xl p-4 flex flex-col min-h-[200px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">ภาษาไทย</span>
            {output && (
              <button onClick={handleCopy} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied ? "Copied" : "Copy"}
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-1 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </motion.div>
            ) : (
              <motion.div key="output" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1">
                {correctedEnglish && (
                  <div className="mb-3 rounded-lg bg-primary/5 p-2 text-xs">
                    <span className="font-medium text-primary">Corrected:</span>{" "}
                    <span className="text-foreground">{correctedEnglish}</span>
                  </div>
                )}
                <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                  {output || <span className="text-muted-foreground/50">Translation will appear here...</span>}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={onClear}
          className="flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm text-muted-foreground transition-all hover:bg-secondary"
        >
          <Eraser className="h-4 w-4" />
          Clear
        </button>
        <button
          onClick={onTranslate}
          disabled={!input.trim() || isLoading}
          className="flex items-center gap-2 rounded-xl bg-primary px-8 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 disabled:opacity-50 disabled:shadow-none"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
          Translate
        </button>
      </div>
      <p className="text-center text-[11px] text-muted-foreground"></p>
    </motion.div>
  );
}
