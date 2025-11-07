import Image from "next/image";
import ChatBox from "../components/ChatBox";
const logo = "/logo.png";

export default function Home() {
  return (
    <div className="page-container">
      <header className="header">
        <div className="logo-area">
          <Image src={logo} alt="SalesGenie Logo" width={45} height={45} className="logo" />
          <h1 className="brand-text">SalesGenie</h1>
        </div>
      </header>

      <main className="main-content">
        <ChatBox />
      </main>
    </div>
  );
}
