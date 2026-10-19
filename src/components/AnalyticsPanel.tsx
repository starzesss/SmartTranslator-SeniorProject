import { BarChart3, X } from "lucide-react";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import type { TranslationRecord } from "@/hooks/useTranslationHistory";

interface AnalyticsPanelProps {
  history: TranslationRecord[];
}

const COLORS = ["hsl(228, 65%, 55%)", "hsl(228, 65%, 70%)", "hsl(228, 65%, 42%)", "hsl(220, 15%, 60%)", "hsl(220, 15%, 75%)"];

export default function AnalyticsPanel({ history }: AnalyticsPanelProps) {
  const [open, setOpen] = useState(false);

  const dailyData = useMemo(() => {
    const map = new Map<string, { count: number; words: number }>();
    history.forEach((r) => {
      const day = new Date(r.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const entry = map.get(day) || { count: 0, words: 0 };
      entry.count++;
      entry.words += r.wordCount;
      map.set(day, entry);
    });
    return Array.from(map.entries())
      .map(([day, d]) => ({ day, ...d }))
      .reverse()
      .slice(-7);
  }, [history]);

  const topWords = useMemo(() => {
    const map = new Map<string, number>();
    history.forEach((r) => {
      r.input.toLowerCase().split(/\s+/).filter((w) => w.length > 2).forEach((w) => {
        map.set(w, (map.get(w) || 0) + 1);
      });
    });
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word, count]) => ({ word, count }));
  }, [history]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-secondary transition-all"
      >
        <BarChart3 className="h-4 w-4" />
        Analytics
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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl z-50 rounded-2xl border border-border bg-background shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between p-5 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">📊 Translation Analytics</h2>
                <button onClick={() => setOpen(false)} className="rounded-full p-1 hover:bg-secondary">
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>

              <div className="p-5 space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Translations", value: history.length },
                    { label: "Total Words", value: history.reduce((s, r) => s + r.wordCount, 0) },
                    { label: "Today", value: history.filter((r) => new Date(r.timestamp).toDateString() === new Date().toDateString()).length },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl bg-secondary/50 p-3 text-center">
                      <div className="text-2xl font-bold text-foreground">{s.value}</div>
                      <div className="text-xs text-muted-foreground">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Daily Chart */}
                {dailyData.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-foreground mb-3">Daily Usage</h3>
                    <ResponsiveContainer width="100%" height={180}>
                      <BarChart data={dailyData}>
                        <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(220,10%,50%)" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: "hsl(220,10%,50%)" }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(220,15%,90%)", fontSize: 12 }} />
                        <Bar dataKey="count" fill="hsl(228, 65%, 55%)" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Top Words */}
                {topWords.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-foreground mb-3">Most Translated Words</h3>
                    <ResponsiveContainer width="100%" height={180}>
                      <PieChart>
                        <Pie data={topWords} dataKey="count" nameKey="word" cx="50%" cy="50%" outerRadius={70} label={({ word }) => word}>
                          {topWords.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(220,15%,90%)", fontSize: 12 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {history.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground py-8">Translate some text to see analytics!</p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
