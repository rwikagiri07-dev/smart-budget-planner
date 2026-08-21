import { useState, useRef, useEffect } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import "./AskAI.css";

function AskAI() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hi! Ask me anything about your budget, expenses, or events.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  // Don't show the widget until the user is logged in
  if (!user) return null;

  const toggleChat = () => setIsOpen((prev) => !prev);

  const handleSend = async (e) => {
    e.preventDefault();
    const question = input.trim();
    if (!question || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setInput("");
    setLoading(true);

    try {
      const { data } = await api.post("/ai/ask", { question });
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: data.answer || "Sorry, I couldn't find an answer.",
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text:
            error?.response?.data?.message ||
            "Something went wrong while contacting the AI service.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ask-ai-root">
      {isOpen && (
        <div className="ask-ai-panel">
          <div className="ask-ai-header">
            <span>Ask AI</span>
            <button
              className="ask-ai-close"
              onClick={toggleChat}
              aria-label="Close AI chat"
            >
              ×
            </button>
          </div>

          <div className="ask-ai-messages" ref={scrollRef}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`ask-ai-message ${
                  msg.role === "user"
                    ? "ask-ai-message-user"
                    : "ask-ai-message-ai"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="ask-ai-message ask-ai-message-ai ask-ai-typing">
                Thinking...
              </div>
            )}
          </div>

          <form className="ask-ai-input-row" onSubmit={handleSend}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your budget..."
              disabled={loading}
            />
            <button type="submit" disabled={loading || !input.trim()}>
              Send
            </button>
          </form>
        </div>
      )}

      <button
        className="ask-ai-fab"
        onClick={toggleChat}
        aria-label="Toggle AI chat"
      >
        {isOpen ? "×" : "AI"}
      </button>
    </div>
  );
}

export default AskAI;

