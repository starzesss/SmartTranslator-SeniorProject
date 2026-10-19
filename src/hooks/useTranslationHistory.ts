import { useState, useEffect, useCallback } from "react";

export interface TranslationRecord {
  id: string;
  input: string;
  output: string;
  mode: string;
  tone: string;
  grammarFix: boolean;
  correctedEnglish?: string;
  breakdown?: BreakdownItem[];
  timestamp: number;
  wordCount: number;
}

export interface BreakdownItem {
  english: string;
  thai: string;
  partOfSpeech: string;
  explanation: string;
}

const STORAGE_KEY = "linguabridge_history";
const MAX_HISTORY = 200;

function loadHistory(): TranslationRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function generateId(): string {
  if (typeof window !== "undefined" && window.crypto && typeof window.crypto.randomUUID === "function") {
    try {
      return window.crypto.randomUUID();
    } catch {
      
    }
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function useTranslationHistory() {
  const [history, setHistory] = useState<TranslationRecord[]>(loadHistory);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const addRecord = useCallback((record: Omit<TranslationRecord, "id" | "timestamp" | "wordCount">) => {
    const newRecord: TranslationRecord = {
      ...record,
      id: generateId(),
      timestamp: Date.now(),
      wordCount: record.input.trim().split(/\s+/).filter(Boolean).length,
    };
    setHistory((prev) => [newRecord, ...prev].slice(0, MAX_HISTORY));
    return newRecord;
  }, []);

  const clearHistory = useCallback(() => setHistory([]), []);

  return { history, addRecord, clearHistory };
}