import { GoogleGenerativeAI, Type } from "@google/generative-ai";

// Initialize the GoogleGenAI client
// It will automatically look for the GEMINI_API_KEY environment variable
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * @param {string} transcript
 * @returns {Promise<object>} 
 */
export async function summarizeAndExtract(transcript) {
  const systemInstruction = `You are a helpful assistant specialized in processing meeting transcripts. Your task is to extract a summary and action items, strictly adhering to the provided JSON schema.`;

  const taskSchema = {
    type: Type.OBJECT,
    properties: {
      task: {
        type: Type.STRING,
        description: "Short title or description of the action item.",
      },
      owner_name: {
        type: Type.STRING,
        description: "The name of the person responsible for the task. Use null if the name is not present or cannot be inferred.",
        nullable: true,
      },
      owner_email: {
        type: Type.STRING,
        description: "The inferred email address of the owner, using a common corporate domain (e.g., '@examplecorp.com') if a name is present. Use null if an email cannot be inferred.",
        nullable: true,
      },
      deadline: {
        type: Type.STRING,
        description: "The specific date or date format (ISO-8601 or natural language) for the task deadline. Use null if no deadline is mentioned.",
        nullable: true,
      },
      priority: {
        type: Type.STRING,
        description: "The inferred priority of the task. Must be one of: 'low', 'medium', or 'high'. Use null if priority is not clearly inferred.",
        enum: ["low", "medium", "high", "null"], 
      },
    },
    required: ["task"],
  };

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      summary: {
        type: Type.ARRAY,
        description: "A short 3-5 bullet point summary of the meeting, where each bullet is a string.",
        items: {
          type: Type.STRING
        }
      },
      tasks: {
        type: Type.ARRAY,
        description: "An array of action items extracted from the transcript, each adhering to the Task schema.",
        items: taskSchema,
      },
    },
    required: ["summary", "tasks"],
  };

  const userPrompt = `Given the meeting transcript below, generate the JSON object that adheres to the schema.
  
  Transcript:
  """${transcript}"""`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        maxOutputTokens: 800,
      },
    });

    // 5. Parse the guaranteed valid JSON response
    const jsonText = response.text.trim();
    const parsed = JSON.parse(jsonText);

    return parsed;
  } catch (error) {
    console.error("Error summarizing transcript with Gemini:", error);
    // Return a default empty structure on failure
    return {
      summary: [],
      tasks: [],
      error: error.message
    };
  }
}

// Example usage (assuming you define a transcript variable)
/*
const sampleTranscript = `The meeting started at 10 AM. Sarah confirmed the budget for the Q4 campaign is approved. She needs to finalize the vendor contracts by Friday, October 25th (high priority). John mentioned the website redesign mockups are ready, and he will send them out for review next week. Mark said he's blocked on the server migration but will update the team by the end of the day tomorrow (low priority).`;
summarizeAndExtract(sampleTranscript)
  .then(result => console.log(JSON.stringify(result, null, 2)))
  .catch(console.error);
*/