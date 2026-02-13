import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateText } from "ai";
import { NextResponse } from "next/server";

/**
 * API Route for generating project tasks.
 * Expects a JSON body with a 'prompt' field containing the project details.
 */
export async function POST(req: Request) {
  try {
    // 1. Parse the incoming request body
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 },
      );
    }

    // 2. Initialize the OpenRouter provider
    const openrouter = createOpenRouter({
      apiKey: process.env.OPENROUTER_KEY,
    });

    // 3. Call the AI model
    // We use a specific model optimized for instruction following.
    const { text } = await generateText({
      model: openrouter("google/gemini-2.0-flash-001"),
      system:
        "You are an expert Software Architect and Technical Lead. Your task is to break down feature requests into high-quality user stories and engineering tasks. Please limit the story under 10 lines only.",
      prompt: prompt,
    });

    // 4. Return the generated text as a JSON response
    return NextResponse.json({ text });
  } catch (error) {
    console.error("AI Route Error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 },
    );
  }
}
