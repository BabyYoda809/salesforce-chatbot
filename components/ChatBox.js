// components/ChatBox.js
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import FlowChart from "./FlowChart";

export default function ChatBox() {
  const [messages, setMessages] = useState([
    { role: "assistant", type: "text", content: "Hello! How can I assist you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

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
        body: JSON.stringify({ question: input }),
      });

      if (!res.ok) throw new Error("Network response failed");
      const data = await res.json();

      let type = "text";
      let content = data.answer;

      if (content.startsWith("flow:")) {
        type = "flowchart";
        content = content.replace(/^flow:\s*/, "");
      }

      setMessages((prev) => [...prev, { role: "assistant", type, content }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", type: "text", content: "⚠️ Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="chat-container">
      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            {msg.type === "flowchart" ? (
              <FlowChart chartDef={msg.content} />
            ) : (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {msg.content}
              </ReactMarkdown>
            )}
          </div>
        ))}
        {loading && <div className="message assistant">💭 Thinking...</div>}
      </div>
      <div className="input-container">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question here..."
          rows={2}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
