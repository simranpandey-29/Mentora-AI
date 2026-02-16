import React, { useContext, useEffect, useRef } from "react";
import "./Main.css";
import { assets } from "../../assets/assets";
import { Context } from "../../context/Context";

const Main = () => {
  const { onSent, input, setInput, loading, messages } = useContext(Context);

  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => (prev ? prev + " " + transcript : transcript));
      };

      recognition.onerror = (err) => {
        console.error("Mic error:", err);
        alert("Mic permission denied or not supported.");
      };

      recognitionRef.current = recognition;
    }
  }, [setInput]);
  
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setInput((prev) => (prev ? prev + ` [Attached: ${file.name}]` : `[Attached: ${file.name}]`));
  };

  const handleMicClick = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    recognitionRef.current.start();
  };

  return (
    <div className="main">
      <div className="nav">
        <p>Mentora AI</p>
        <img src={assets.user_icon} alt="user" />
      </div>

      <div className="main-container">
        <div className="result">
          {messages.length === 0 && !loading ? (
            <div className="empty-state">
              <p className="hello">
                <span>Hello Developers...</span>
              </p>
              <p className="sub">How can I help you today?</p>
            </div>
          ) : (
            <>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={msg.role === "user" ? "user-msg" : "ai-msg"}
                >
                  <img
                    src={
                      msg.role === "user"
                        ? assets.user_icon
                        : assets.gemini_icon
                    }
                    alt=""
                  />
                  <p>{msg.text}</p>
                </div>
              ))}

              {loading && (
                <div className="ai-msg">
                  <img src={assets.gemini_icon} alt="" />
                  <p>Listening / Thinking...</p>
                </div>
              )}
            </>
          )}

          <div ref={bottomRef} />
        </div>

        <div className="main-bottom">
          <div className="search-box">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading) onSent();
              }}
              placeholder="Ask something..."
              disabled={loading}
            />

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleFileChange}
            />

            <div>
              <img
                src={assets.gallery_icon}
                alt="upload"
                onClick={handleImageClick}
                title="Upload image"
              />
              <img
                src={assets.mic_icon}
                alt="mic"
                onClick={handleMicClick}
                title="Speak"
              />
              <img
                src={assets.send_icon}
                alt="send"
                onClick={() => !loading && onSent()}
                title="Send"
              />
            </div>
          </div>

          <p className="bottom-info">
            Gemini may display inaccurate info. Double-check responses.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;
