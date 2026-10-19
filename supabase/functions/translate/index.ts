import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function buildPrompt(text: string, mode: string, tone: string, grammarFix: boolean): string {
  const modeInstructions: Record<string, string> = {
    literal: "Translate word-by-word as literally as possible, keeping the original sentence structure even if it sounds unnatural in Thai.",
    natural: "Translate into smooth, natural-sounding Thai that a native speaker would use. Prioritize readability and fluency.",
    "context-aware":
      "Translate with full understanding of context, idioms, slang, and implied meaning. Adapt the translation so it conveys the same feeling and intent, not just the literal words. For example, 'I'm dead' in a casual context means exhaustion, not literal death.",
  };

  const toneInstructions: Record<string, string> = {
    formal: "Use formal, polite Thai (ภาษาทางการ). Use polite particles (ครับ/ค่ะ where appropriate). Suitable for academic or professional contexts.",
    casual: "Use everyday conversational Thai (ภาษาพูด). Relaxed and friendly tone.",
    genz: "Use trendy Thai internet/Gen Z language. Include modern slang, abbreviations, and expressions popular among young Thai people online.",
  };

  let systemPrompt = `You are an expert English to Thai translator.

${modeInstructions[mode] || modeInstructions.natural}
${toneInstructions[tone] || toneInstructions.casual}

You MUST respond with a JSON object using this exact tool call format.`;

  if (grammarFix) {
    systemPrompt += `\n\nIMPORTANT: First, correct any grammar or spelling mistakes in the English text. Rewrite it into proper, natural English. Then translate the corrected version. Include the corrected English in your response as "corrected_english".`;
  }

  systemPrompt += `\n\nAlso provide a word-by-word breakdown of the translation with:
- "english": the English word/phrase
- "thai": the Thai equivalent
- "part_of_speech": grammatical role (noun, verb, adjective, adverb, particle, pronoun, conjunction, preposition, etc.)
- "explanation": brief explanation of usage or meaning

Translate this text: "${text}"`;

  return systemPrompt;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, mode, tone, grammarFix } = await req.json();

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return new Response(JSON.stringify({ error: "Text is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    }

    const systemPrompt = buildPrompt(text, mode || "natural", tone || "casual", grammarFix || false);

    const tools = [
      {
        type: "function",
        function: {
          name: "return_translation",
          description: "Return the translation result with breakdown.",
          parameters: {
            type: "object",
            properties: {
              translation: { type: "string", description: "The Thai translation" },
              corrected_english: {
                type: "string",
                description: "The corrected English text (only if grammar fix was requested)",
              },
              breakdown: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    english: { type: "string" },
                    thai: { type: "string" },
                    part_of_speech: { type: "string" },
                    explanation: { type: "string" },
                  },
                  required: ["english", "thai", "part_of_speech", "explanation"],
                  additionalProperties: false,
                },
              },
            },
            required: ["translation", "breakdown"],
            additionalProperties: false,
          },
        },
      },
    ];

      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: text },
        ],
        tools,
        tool_choice: { type: "function", function: { name: "return_translation" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall) {
      throw new Error("No tool call in AI response");
    }

    const result = JSON.parse(toolCall.function.arguments);

    const formatted = {
      translation: result.translation,
      correctedEnglish: result.corrected_english || undefined,
      breakdown: (result.breakdown || []).map((b: any) => ({
        english: b.english,
        thai: b.thai,
        partOfSpeech: b.part_of_speech,
        explanation: b.explanation,
      })),
    };

    return new Response(JSON.stringify(formatted), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("translate error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
