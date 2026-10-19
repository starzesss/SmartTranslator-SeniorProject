import { cn } from "@/lib/utils";

const TONES = [
  { value: "formal" as const, label: "Formal", emoji: "🎓" },
  { value: "casual" as const, label: "Casual", emoji: "💬" },
  { value: "genz" as const, label: "Slangs", emoji: "😎" },
];

interface ToneSelectorProps {
  value: "formal" | "casual" | "genz";
  onChange: (v: "formal" | "casual" | "genz") => void;
}

export default function ToneSelector({ value, onChange }: ToneSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tone</span>
      <div className="flex gap-2">
        {TONES.map((t) => (
          <button
            key={t.value}
            onClick={() => onChange(t.value)}
            className={cn(
              "flex-1 rounded-xl px-3 py-2 text-center transition-all text-sm",
              value === t.value
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            <span className="mr-1">{t.emoji}</span>
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
