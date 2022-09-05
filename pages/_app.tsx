import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import { SettingsProvider } from "../contexts/settings";
import "../global.css";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <SettingsProvider>
      <SessionProvider session={pageProps.session}>
        <Component {...pageProps} />
      </SessionProvider>
    </SettingsProvider>
  );
};

export default App;
