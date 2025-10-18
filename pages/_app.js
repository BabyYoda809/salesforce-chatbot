// pages/_app.js
import Head from "next/head";
import { Poppins } from "next/font/google";
import "../styles/globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

import { JetBrains_Mono } from "next/font/google";

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
});


export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>SalesGenie</title>
        <meta name="description" content="SalesGenie - Your Salesforce AI Assistant" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={poppins.className}>
        <Component {...pageProps} />
      </main>
    </>
  );
}
