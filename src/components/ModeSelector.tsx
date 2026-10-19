import { cn } from "@/lib/utils";

const MODES = [
  { value: "literal" as const, label: "Literal", desc: "Word-by-word" },
  { value: "natural" as const, label: "Natural", desc: "Human-sounding" },
  { value: "context-aware" as const, label: "Context-Aware", desc: "Idioms & slang" },
];

interface ModeSelectorProps {
  value: "literal" | "natural" | "context-aware";
  onChange: (v: "literal" | "natural" | "context-aware") => void;
}

export default function ModeSelector({ value, onChange }: ModeSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Context Mode</span>
      <div className="flex gap-2">
        {MODES.map((m) => (
          <button
            key={m.value}
            onClick={() => onChange(m.value)}
            className={cn(
              "flex-1 rounded-xl px-3 py-2.5 text-center transition-all text-sm",
              value === m.value
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            <div className="font-medium">{m.label}</div>
            <div className={cn("text-[10px] mt-0.5", value === m.value ? "text-primary-foreground/70" : "text-muted-foreground")}>{m.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
