import ChatBox from "../components/ChatBox";

export default function Home() {
  return (
    <>
      <header className="header">
        <div className="logo-title">
          {/* Use favicon.ico as small SG logo */}
          <img src="/favicon.ico" alt="SalesGenie Logo" className="logo-small" />
          <h1>SalesGenie</h1>
        </div>
      </header>

      <div className="chat-wrapper">
        <ChatBox />
      </div>
    </>
  );
}
