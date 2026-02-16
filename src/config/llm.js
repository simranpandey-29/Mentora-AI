// async function run(prompt) {
//   try {
//     const apiKey = import.meta.env.VITE_GROQ_API_KEY;

//     const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${apiKey}`,
//       },
//       body: JSON.stringify({
//         model: "llama-3.1-8b-instant",
//         messages: [
//           { role: "system", content: "You are a helpful AI assistant." },
//           { role: "user", content: prompt },
//         ],
//         temperature: 0.7,
//         max_tokens: 300,
//       }),
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       console.error("Groq API Error:", data);
//       throw new Error(data.error?.message || "Groq API failed");
//     }

//     return data.choices?.[0]?.message?.content || "No response from AI";
//   } catch (error) {
//     console.error("LLM Error:", error);
//     return "I’m having trouble connecting to the AI service right now. Please try again in a moment.";
//   }
// }

// export default run;


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
        messages: messages,  // 👈 full conversation
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

