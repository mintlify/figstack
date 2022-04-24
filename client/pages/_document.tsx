import Document, {
  Html, Head, Main, NextScript,
} from 'next/document';

const GA_TRACKING_ID = 'G-TYYLTLML3Q';

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* Google analytics */}
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          />
          <script
                // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
            }}
          />
          {/* Stripe */}
          <script src="https://js.stripe.com/v3/" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
