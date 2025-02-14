import { openai } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText } from "ai";
import { Pica } from "@picahq/ai";

export async function POST(request) {
  try {
    const { title,altEmail } = await request.json(); // Parse the incoming request JSON to get the book title and email
 let email = altEmail || 'alistair.fernandes@ajackus.com'
    const pica = new Pica(process.env.PICA_SECRET_KEY); // Initialize Pica with the secret key

    // Generate the system prompt using Pica
    const systemPrompt = await pica.generateSystemPrompt();

    // Set up streaming text using OpenAI and Pica
    const stream = streamText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      tools: { ...pica.oneTool },
      messages: convertToCoreMessages([
        {
          role: "user",
//content: `send an email to ${email} with the subject '${title} Book Summary' and the body as short one line summary of ${title} . userid should be 'me' .do not ask for confirmation send the mail straight away`,
content: `send an email to ${email} with the subject '${title} Book Summary' and the body as short one line summary and one key take away of ${title} . userId for email should be 'me' . do not ask for confirmation send the mail straight away`,
        },
      ]),
      maxSteps: 10,
    });

    // Return the response as a streaming data response
    const result = await stream;
    if (result && typeof result.toDataStreamResponse === "function") {
      return result.toDataStreamResponse({
        getErrorMessage: errorHandler,
      });
    } else {
      console.error("Error: The result doesn't have toDataStreamResponse.");
      return new Response("Internal Server Error", { status: 500 });
    }
  } catch (error) {
    console.error("Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export function errorHandler(error) {
  if (error == null) {
    return "unknown error";
  }

  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return JSON.stringify(error);
}