
'use server';
/**
 * @fileOverview An AI flow to enhance scrapbook messages.
 *
 * - enhanceScrapbookMessage - A function that enhances a user's scrapbook message and title.
 * - EnhanceScrapbookMessageInput - The input type for the enhanceScrapbookMessage function.
 * - EnhanceScrapbookMessageOutput - The return type for the enhanceScrapbookMessage function.
 */

/*  This file must stay server-only.
    To avoid Next.js including heavy Genkit/Gemini code in any possible
    client bundle, do NOT import the `ai` helper at the module top-level.
    Instead we dynamically import it inside a lazy getter. */

import { z } from 'genkit';

const EnhanceScrapbookMessageInputSchema = z.object({
  originalMessage: z.string().describe('The original message content written by the user.'),
  originalTitle: z.string().optional().describe('The original title provided by the user (can be empty).'),
});
export type EnhanceScrapbookMessageInput = z.infer<typeof EnhanceScrapbookMessageInputSchema>;

const EnhanceScrapbookMessageOutputSchema = z.object({
  enhancedMessage: z.string().describe('The message content, enhanced with 2-3 relevant emojis integrated naturally within the text. If the original message is very short, the AI can slightly expand it if appropriate while keeping the user original intent.'),
  enhancedTitle: z.string().describe('A concise, engaging, and celebratory title for the scrapbook post. If the original title was good, it can be kept or slightly improved. If it was empty or too generic, a new one should be generated.'),
  suggestedAccentColor: z.enum(['accent1', 'accent2']).describe("Suggest either 'accent1' (magenta - for vibrant, energetic, or very positive messages) or 'accent2' (gold - for warm, celebratory, or slightly more formal good wishes) based on the overall tone and content of the message and title."),
});
export type EnhanceScrapbookMessageOutput = z.infer<typeof EnhanceScrapbookMessageOutputSchema>;

// -------- Lazy Genkit Flow (server-only) -----------------------------------
// We memo-store the built flow so we only pay the setup cost once.
let cachedFlow:
  | ((input: EnhanceScrapbookMessageInput) => Promise<EnhanceScrapbookMessageOutput>)
  | undefined;

async function getFlow() {
  if (cachedFlow) return cachedFlow;

  // Dynamically import to ensure Genkit never appears in client bundles.
  const { ai } = await import('@/ai/genkit');

  const enhanceMessagePrompt = ai.definePrompt({
    name: 'enhanceScrapbookMessagePrompt',
    input: { schema: EnhanceScrapbookMessageInputSchema },
    output: { schema: EnhanceScrapbookMessageOutputSchema },
    prompt: `You are an AI assistant helping to enhance birthday messages for a digital scrapbook for Ramon's 50th birthday party.
Your goal is to make the user's submission more engaging and visually appealing within the scrapbook's theme.

Party Vibe: Fun, celebratory, energetic, memorable.
Available Accent Colors:
- 'accent1': A vibrant magenta, good for high-energy, very positive, or playful messages.
- 'accent2': A rich gold, good for warm wishes, celebratory toasts, or slightly more heartfelt/formal messages.

User's Original Input:
Original Title: {{{originalTitle}}}
Original Message: {{{originalMessage}}}

Your Task:
1.  **Enhanced Title**: Create a concise, engaging, and celebratory title.
    *   If the original title is good, you can keep it or slightly improve it.
    *   If the original title is empty, very generic (e.g., "Happy Birthday"), or could be much better, generate a new one fitting the message.
    *   Aim for 3-7 words.
2.  **Enhanced Message**: Review the original message.
    *   Subtly integrate 2-3 relevant emojis naturally within the message content to add visual flair and emotion. Do not just append them at the end.
    *   If the original message is very short (e.g., less than 10 words) and a bit plain, you can slightly elaborate on it to make it a bit more expressive, but stick closely to the user's original sentiment and intent. Do not invent new facts or memories.
    *   Ensure the tone remains authentic to a personal birthday message.
3.  **Suggested AccentColor**: Based on the overall tone, sentiment, and content of the *original message and title*, choose either 'accent1' or 'accent2'.

Provide your response in the format specified by the output schema.
`,
  });

  const flow = ai.defineFlow(
    {
      name: 'enhanceScrapbookMessageFlow',
      inputSchema: EnhanceScrapbookMessageInputSchema,
      outputSchema: EnhanceScrapbookMessageOutputSchema,
    },
    async (input: EnhanceScrapbookMessageInput) => {
      // Provide default for optional title if not present for the prompt
      const promptInput = {
        originalMessage: input.originalMessage,
        originalTitle: input.originalTitle || '',
      };
      const { output } = await enhanceMessagePrompt(promptInput);
      if (!output) {
        throw new Error('AI failed to generate an enhanced message.');
      }
      return output;
    }
  );

  cachedFlow = flow;
  return flow;
}

export async function enhanceScrapbookMessage(input: EnhanceScrapbookMessageInput): Promise<EnhanceScrapbookMessageOutput> {
  const flow = await getFlow();
  return flow(input);
}
