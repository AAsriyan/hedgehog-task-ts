import WalletContextProvider from "../components/WalletContextProvider";

import type { AppProps } from "next/app";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<WalletContextProvider>
			<Component {...pageProps} />
		</WalletContextProvider>
	);
}

export default MyApp;
