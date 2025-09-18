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
      sources: [] // no sources since we’re not doing web search
    })
  } catch (err) {
    console.error(err)
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
      // optional but recommended by OpenRouter:
      'HTTP-Referer': 'http://localhost:3000',
      'X-Title': 'Salesforce Chatbot'
    },
    body: JSON.stringify({
      model: 'openai/gpt-4o-mini', // can swap with other models if you like
      messages: [
        { role: 'system', content: 'You are a helpful Salesforce developer assistant. Format answers as plain text (no markdown).' },
        { role: 'user', content: prompt }
      ],
      temperature: 0,
      max_tokens: 500
    })
  })

  if (!resp.ok) {
    const txt = await resp.text()
    throw new Error('OpenRouter error: ' + resp.status + ' ' + txt)
  }

  const j = await resp.json()
  const rawAnswer = j.choices?.[0]?.message?.content || ''
  return cleanMarkdown(rawAnswer)
}

// --- Markdown cleanup ---
function cleanMarkdown(text) {
  if (!text) return ''
  return text
    // remove code fences like ```sql or ```
    .replace(/```[a-z]*\n?/gi, '')
    .replace(/```/g, '')
    // remove Markdown headings ###, ##
    .replace(/^#+\s*/gm, '')
    // remove bold/italic markers ** and *
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    // remove underscores
    .replace(/_/g, '')
    // trim extra spaces
    .trim()
}
