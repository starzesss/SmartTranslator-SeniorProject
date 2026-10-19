import { Moon, Sun, Languages } from "lucide-react";
import { motion } from "framer-motion";
interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
}
export default function Header({
  isDark,
  onToggleTheme
}: HeaderProps) {
  return <motion.header initial={{
    opacity: 0,
    y: -20
  }} animate={{
    opacity: 1,
    y: 0
  }} className="flex items-center justify-between px-6 py-4 md:px-10">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
          <Languages className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-foreground">SmartTranslate (Beta)</h1>
          <p className="text-xs text-muted-foreground">EN → TH Smart Translator</p>
        </div>
      </div>

      <button onClick={onToggleTheme} className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-secondary" aria-label="Toggle theme">
        {isDark ? <Sun className="h-4 w-4 text-foreground" /> : <Moon className="h-4 w-4 text-foreground" />}
      </button>
    </motion.header>;
}