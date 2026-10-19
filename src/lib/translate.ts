import { supabase } from "@/integrations/supabase/client";

export interface TranslateRequest {
  text: string;
  mode: "literal" | "natural" | "context-aware";
  tone: "formal" | "casual" | "genz";
  grammarFix: boolean;
}

export interface TranslateResponse {
  translation: string;
  correctedEnglish?: string;
  breakdown: {
    english: string;
    thai: string;
    partOfSpeech: string;
    explanation: string;
  }[];
}

export async function translate(req: TranslateRequest): Promise<TranslateResponse> {
  const { data, error } = await supabase.functions.invoke("translate", {
    body: req,
  });

  if (error) throw new Error(error.message || "Translation failed");
  return data as TranslateResponse;
}
