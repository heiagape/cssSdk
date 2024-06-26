import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html>
            <Head>
                {/* <link rel='stylesheet' href='/font/fontawesome-free-6.2.0-web/css/all.min.css' /> */}

                <script
                    data-partytown-config
                    dangerouslySetInnerHTML={{
                        __html: `
              window.remoteImport = (url) => import(url)
              window.import = (url) => import(url)
            `,
                    }}
                />
            </Head>
            <body className='h-full w-full'>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}
