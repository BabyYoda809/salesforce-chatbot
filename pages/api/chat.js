const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args))

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' })
  }

  const { question } = req.body
  if (!question) return res.status(400).json({ error: 'Missing question' })

  try {
    const answer = await callOpenRouter(question)
    res.status(200).json({
      answer: answer.trim(),
      sources: []
    })
  } catch (err) {
    console.error("API ERROR:", err.message)
    res.status(500).json({ error: err.message })
  }
}

// --- OpenRouter call ---
async function callOpenRouter(prompt) {
  const key = process.env.OPENROUTER_API_KEY
  if (!key) throw new Error('OPENROUTER_API_KEY not set')

  const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
      'HTTP-Referer': 'https://salesgenie.vercel.app/', // 👈 update to your real domain
      'X-Title': 'SalesGenie'
    },
    body: JSON.stringify({
      model: 'openai/gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a helpful Salesforce assistant.
If the user asks for a process flow, workflow, or diagram:
- Respond in Mermaid.js format only (no explanations).
- Always start your reply with "flow:" on the first line.
Example:
flow:
flowchart TD
    A[Lead] --> B[Opportunity]
    B --> C[Proposal]
    C --> D[Closed Won]

Otherwise, respond in plain text only (no markdown, no formatting).`
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 600
    })
  })

  if (!resp.ok) {
    const txt = await resp.text()
    throw new Error(`OpenRouter error ${resp.status}: ${txt}`)
  }

  const j = await resp.json()
  console.log("OpenRouter raw response:", j) // 👈 helpful in Vercel logs
  return cleanMarkdown(j.choices?.[0]?.message?.content || '')
}

// --- Markdown cleanup ---
function cleanMarkdown(text) {
  if (!text) return ''
  return text
    .replace(/```[a-z]*\n?/gi, '')
    .replace(/```/g, '')
    .replace(/^#+\s*/gm, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/_/g, '')
    .trim()
}
