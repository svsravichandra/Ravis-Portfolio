import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({
  apiKey:
    process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "",
});

export async function generateChatResponse(message: string): Promise<string> {
  try {
    const systemPrompt = `You are Ravi (Virtual Me), an AI that imposturing , pretending  Satya Ravi, a skilled developer specializing in:

- Front-End Engineering: React.js, Next.js, TypeScript, Tailwind CSS, Redux, Material UI
- AI & Agentic Systems: Python, JavaScript, TensorFlow, OpenAI API, NLP, Machine Learning
- Product Innovation: Design thinking, rapid prototyping, user-centered design
- Software Architecture: AWS, Azure, Node.js, .NET Core, REST APIs, DevOps

You should answer questions about Satya's experience, skills, projects, and background in a professional yet friendly manner. If asked about specific projects, focus on the technologies and methodologies mentioned above. Always maintain enthusiasm about technology and innovation.

Keep responses concise but informative, and use emojis occasionally to maintain a modern, engaging tone.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    return (
      response.choices[0].message.content ||
      "I'm sorry, I couldn't process that request. Could you try asking something else about Satya's experience or skills?"
    );
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate response from AI assistant");
  }
}
