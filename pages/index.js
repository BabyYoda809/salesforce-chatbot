import Head from 'next/head'
import ChatBox from '../components/ChatBox'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Salesforce Chatbot — PoC</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main style={{ maxWidth: 800, margin: '40px auto', padding: '0 16px' }}>
        <h1>Salesforce Chatbot (PoC)</h1>
        <p>Ask a Salesforce developer question — the bot will search the web and answer with sources.</p>
        <ChatBox />
      </main>
    </div>
  )
}
