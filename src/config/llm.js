async function run(messages) {
  try {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: messages,  
        temperature: 0.7,
        max_tokens: 400,
      }),
    });

    const data = await res.json();
    return data.choices[0].message.content;
  } catch (e) {
    return "AI service error.";
  }
}

export default run;

