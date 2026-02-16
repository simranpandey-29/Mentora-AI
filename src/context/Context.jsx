import { createContext, useState } from "react";
import run from "../config/llm";
export const Context = createContext();

const ContextProvider = ({ children }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);        // current chat messages
  const [chatHistory, setChatHistory] = useState([]); // saved sessions
  const [loading, setLoading] = useState(false);

  const newChat = () => {
    if (messages.length > 0) {
      setChatHistory((prev) => [
        ...prev,
        {
          id: Date.now(),
          title:
            messages.find((m) => m.role === "user")?.text?.slice(0, 20) ||
            "New Chat",
          messages: messages,
        },
      ]);
    }
    setMessages([]);
    setLoading(false);
  };

  const onSent = async (prompt) => {
    const userMessage = (prompt ?? input).trim();
    if (!userMessage || loading) return;

    setInput("");
    setLoading(true);

    // 1️⃣ Update UI immediately with user message
    const updatedMessages = [
      ...messages,
      { role: "user", text: userMessage },
    ];
    setMessages(updatedMessages);

    try {
      // 2️⃣ Prepare full conversation for LLM
      const apiMessages = [
        { role: "system", content: "You are a helpful AI assistant." },
        ...updatedMessages.map((m) => ({
          role: m.role === "ai" ? "assistant" : "user",
          content: m.text,
        })),
      ];

      // 3️⃣ Call LLM with conversation context
      const aiReply = await run(apiMessages);

      // 4️⃣ Append AI reply to UI
      setMessages((prev) => [...prev, { role: "ai", text: aiReply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text:
            "I’m having trouble connecting to the AI service right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadChatFromHistory = (chat) => {
    setMessages(chat.messages || []);
  };

  return (
    <Context.Provider
      value={{
        input,
        setInput,
        messages,
        chatHistory,
        loading,
        onSent,
        newChat,
        loadChatFromHistory,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
