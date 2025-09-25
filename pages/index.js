import ChatBox from "../components/ChatBox";

export default function Home() {
  return (
    <>
      <h1>Salesforce Chatbot (PoC)</h1>
      <div className="chat-wrapper">
        <ChatBox />
      </div>
    </>
  );
}
