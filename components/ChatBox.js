// components/ChatBox.js
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import FlowChart from "../components/FlowChart"; // 👈 new import

function normalizeMarkdown(text) {
  if (!text) return "";
  let s = text.replace(/\r\n/g, "\n");

  // Fix "1.\n\nText" -> "1. Text"
  s = s.replace(/(\d+)\.\s*\n\s*/g, "$1. ");

  // Fix "-\nText" -> "- Text"
  s = s.replace(/^\s*[-*]\s*\n+/gm, "- ");

  // Make titles bold (after number, before colon)
  s = s.replace(/^(\d+\.\s*)([^:]+)(:)/gm, (_, num, title, colon) => {
    return `${num} **${title.trim()}**${colon}`;
  });

  return s.trim();
}

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input, type: "text" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMsg.content }),
      });

      const data = await res.json();
      const reply = data.answer ?? data.reply ?? "No answer returned";

      // Check if reply looks like a flowchart (starts with "flow:")
      if (reply.startsWith("flow:")) {
        const chartCode = reply.replace("flow:", "").trim();
        setMessages((prev) => [
          ...prev,
          { role: "assistant", type: "flowchart", content: chartCode },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", type: "text", content: reply },
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          type: "text",
          content: "Error: Could not get a response.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="chat-container">
      <div className="chat-history">
        {messages.length === 0 && (
          <div className="message system">
            Say something like: "Show me a sales process flow"
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`message ${m.role}`}>
            <strong>{m.role === "user" ? "User:" : "Assistant:"}</strong>
            <div className="message-text">
              {m.type === "flowchart" ? (
                <FlowChart chartCode={m.content} />
              ) : (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {normalizeMarkdown(m.content)}
                </ReactMarkdown>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="chat-input-row">
        <textarea
          className="chat-input"
          rows={3}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Ask a Salesforce question..."
        />
        <button
          className="chat-button"
          onClick={sendMessage}
          disabled={loading}
        >
          {loading ? "Thinking..." : "Send"}
        </button>
      </div>
    </div>
  );
}
