import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="SURVIVORS - Pump.fun Meme Coin Battle Royale. Buy the token, survive the storms, win the jackpot." />
        <meta name="keywords" content="pump.fun, meme coin, crypto game, blockchain, survivor, battle royale" />
        <meta name="theme-color" content="#0a0e27" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='75' font-size='75' fill='%2300d9ff'>⚡</text></svg>" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
