export const callOpenAI = async (prompt) => {
  const OPEN_AI_KEY = process.env.REACT_APP_OPENAI_API_KEY;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + OPEN_AI_KEY,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      store: true,
      response_format: { type: "text" },
      temperature: 1,
      max_completion_tokens: 2048,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      messages: [
        {
          role: "system",
          content: [
            {
              type: "text",
              text: "You are a helpful travel assistant. Your tone is excited and poetic. You don't communicate in emoji.",
            },
          ],
        },
        {
          role: "user",
          content: [{ type: "text", text: prompt }],
        },
      ],
    }),
  });
  const data = await response.json();
  return data.choices[0].message.content;
};
