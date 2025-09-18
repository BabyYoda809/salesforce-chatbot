// components/ChatBox.js
import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

function normalizeMarkdown(text) {
  if (!text) return ''
  let s = text.replace(/\r\n/g, '\n')

  // Fix "1.\n\nText" -> "1. Text"
  s = s.replace(/(\d+)\.\s*\n\s*/g, '$1. ')

  // Fix "-\nText" -> "- Text"
  s = s.replace(/^\s*[-*]\s*\n+/gm, '- ')

  // Make titles bold (after number, before colon)
  s = s.replace(/^(\d+\.\s*)([^:]+)(:)/gm, (_, num, title, colon) => {
    return `${num} **${title.trim()}**${colon}`
  })

  return s.trim()
}

export default function ChatBox() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  async function sendMessage() {
    if (!input.trim()) return
    const userMsg = { role: 'user', content: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMsg.content })
      })
      const data = await res.json()
      const reply = data.answer ?? data.reply ?? 'No answer returned'
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      console.error(err)
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error: Could not get a response.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="chat-container">
      <div className="chat-history">
        {messages.length === 0 && (
          <div className="message system">
            Say something like: "How do I query related objects in SOQL?"
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`message ${m.role}`}>
            <strong>{m.role === 'user' ? 'User:' : 'Assistant:'}</strong>
            <div className="message-text">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {normalizeMarkdown(m.content)}
              </ReactMarkdown>
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
              e.preventDefault()
              sendMessage()
            }
          }}
          placeholder="Ask a Salesforce question..."
        />
        <button className="chat-button" onClick={sendMessage} disabled={loading}>
          {loading ? "Thinking..." : "Send"}
        </button>
      </div>
    </div>
  )
}
