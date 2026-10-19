import { useState, useCallback } from "react";
import { toast } from "sonner";
import Header from "@/components/Header";
import ModeSelector from "@/components/ModeSelector";
import ToneSelector from "@/components/ToneSelector";
import TranslationPanel from "@/components/TranslationPanel";
import BreakdownPanel from "@/components/BreakdownPanel";
import HistoryPanel from "@/components/HistoryPanel";
import AnalyticsPanel from "@/components/AnalyticsPanel";
import { useTheme } from "@/hooks/useTheme";
import { useTranslationHistory, type BreakdownItem, type TranslationRecord } from "@/hooks/useTranslationHistory";
import { translate } from "@/lib/translate";

export default function Index() {
  const { isDark, toggle } = useTheme();
  const { history, addRecord, clearHistory } = useTranslationHistory();

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [correctedEnglish, setCorrectedEnglish] = useState<string | undefined>();
  const [breakdown, setBreakdown] = useState<BreakdownItem[]>([]);
  const [mode, setMode] = useState<"literal" | "natural" | "context-aware">("natural");
  const [tone, setTone] = useState<"formal" | "casual" | "genz">("casual");
  const [grammarFix, setGrammarFix] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleTranslate = useCallback(async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    try {
      const result = await translate({ text: input, mode, tone, grammarFix });
      setOutput(result.translation);
      setCorrectedEnglish(result.correctedEnglish);
      setBreakdown(result.breakdown || []);
      addRecord({
        input,
        output: result.translation,
        mode,
        tone,
        grammarFix,
        correctedEnglish: result.correctedEnglish,
        breakdown: result.breakdown,
      });
      toast.success("Translation complete!");
    } catch (e: any) {
      toast.error(e.message || "Translation failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [input, mode, tone, grammarFix, addRecord]);

  const handleClear = () => {
    setInput("");
    setOutput("");
    setCorrectedEnglish(undefined);
    setBreakdown([]);
  };

  const handleSelectHistory = (record: TranslationRecord) => {
    setInput(record.input);
    setOutput(record.output);
    setCorrectedEnglish(record.correctedEnglish);
    setBreakdown(record.breakdown || []);
    setMode(record.mode as any);
    setTone(record.tone as any);
    setGrammarFix(record.grammarFix);
  };

  return (
    <div className="min-h-screen bg-background transition-colors">
      <div className="mx-auto max-w-4xl">
        <Header isDark={isDark} onToggleTheme={toggle} />

        <main className="px-6 pb-10 md:px-10 space-y-5">
          {/* Controls Row */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <ModeSelector value={mode} onChange={setMode} />
            <ToneSelector value={tone} onChange={setTone} />
          </div>

          {/* Translation */}
          <TranslationPanel
            input={input}
            onInputChange={setInput}
            output={output}
            correctedEnglish={correctedEnglish}
            isLoading={isLoading}
            onTranslate={handleTranslate}
            onClear={handleClear}
            grammarFix={grammarFix}
            onGrammarFixChange={setGrammarFix}
          />

          {/* Breakdown */}
          <BreakdownPanel items={breakdown} />

          {/* Bottom Bar */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <HistoryPanel history={history} onSelect={handleSelectHistory} onClear={clearHistory} />
            <AnalyticsPanel history={history} />
          </div>
        </main>
      </div>
    </div>
  );
}
