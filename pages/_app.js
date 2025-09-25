// pages/_app.js
import { Poppins } from "next/font/google";
import "../styles/globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"], // normal, semi-bold, bold
});

export default function MyApp({ Component, pageProps }) {
  return (
    <main className={poppins.className}>
      <Component {...pageProps} />
    </main>
  );
}
