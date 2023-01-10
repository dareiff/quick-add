import PlausibleProvider from 'next-plausible';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
    return (
        <PlausibleProvider
            domain='milkmoney.club'
            selfHosted={true}
            customDomain='https://io.fun-club.xyz'
        >
            <Component {...pageProps} />
        </PlausibleProvider>
    );
}
