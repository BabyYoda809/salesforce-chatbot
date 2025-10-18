import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ChatBox() {
  const [messages, setMessages] = useState([
    { role: "assistant", type: "text", content: "Hello! How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMsg = { role: "user", type: "text", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const reply = data.reply || "⚠️ Something went wrong.";

      setMessages((prev) => [...prev, { role: "assistant", type: "text", content: reply }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", type: "text", content: "⚠️ Something went wrong." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="chat-box">
      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
          </div>
        ))}

        {loading && <div className="message assistant">Typing...</div>}

        {/* Auto-scroll anchor */}
        <div ref={chatEndRef} />
      </div>

      <div className="input-box">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question here..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
