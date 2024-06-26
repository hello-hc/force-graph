import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Graph Examples</title>
        <meta name="description" content="Graph Examples" />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <Component {...pageProps} />
    </>
  );
}
