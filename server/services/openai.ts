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

type ConversationMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function generateVoiceResponse(
  message: string, 
  conversationHistory: ConversationMessage[] = []
): Promise<string> {
  try {
    const systemPrompt = `You are Satya Ravi speaking directly through voice. Keep responses natural and conversational for speech.

You're having a voice conversation about your expertise in:
- Front-End Engineering and modern web technologies
- AI systems and machine learning
- Product innovation and design thinking
- Software architecture and cloud solutions

Guidelines for voice responses:
- Keep responses brief (2-3 sentences) since this is spoken conversation
- Sound warm, engaging, and personable
- Avoid long lists or technical details that are hard to speak
- Be enthusiastic about technology and innovation
- Speak as if you're having a friendly professional conversation`;

    const messages: ConversationMessage[] = [
      { role: "system", content: systemPrompt },
      ...conversationHistory,
      { role: "user", content: message }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages as any,
      max_tokens: 150, // Shorter for voice
      temperature: 0.8, // More natural for voice
    });

    return (
      response.choices[0].message.content ||
      "Let me think about that for a moment. Could you tell me more about what you'd like to know?"
    );
  } catch (error) {
    console.error("Voice API error:", error);
    throw new Error("Failed to generate voice response");
  }
}
