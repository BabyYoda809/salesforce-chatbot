import { useState, useEffect, useRef } from "react";

export default function ChatBox() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! I'm SalesGenie — how can I help with Salesforce today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // ✅ Load memory safely
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("salesgenie-messages");
      if (saved) setMessages(JSON.parse(saved));
    }
  }, []);

  // ✅ Save memory
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("salesgenie-messages", JSON.stringify(messages));
    }
  }, [messages]);

  // ✅ Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();

      if (data?.reply) {
        setMessages([...newMessages, { sender: "bot", text: data.reply }]);
      } else {
        setMessages([...newMessages, { sender: "bot", text: "⚠️ Something went wrong." }]);
      }
    } catch {
      setMessages([...newMessages, { sender: "bot", text: "⚠️ Network error occurred." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    localStorage.removeItem("salesgenie-messages");
    setMessages([
      { sender: "bot", text: "Hello! I'm SalesGenie — how can I help with Salesforce today?" },
    ]);
  };

  return (
    <div className="chatbox">
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-bubble ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {loading && <div className="typing-indicator">SalesGenie is typing...</div>}
        <div ref={chatEndRef} />
      </div>

      <div className="chat-input">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question here..."
        />
        <div className="button-group">
          <button onClick={handleSend}>Send</button>
          <button className="clear" onClick={handleClear}>Clear</button>
        </div>
      </div>
    </div>
  );
}
