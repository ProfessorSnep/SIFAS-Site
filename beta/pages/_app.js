import { CssBaseline, ThemeProvider } from "@material-ui/core";
import Head from "next/head";
import React from "react";
import { theme } from "../src/theme";
// import { ApolloProvider } from "@apollo/client";
// import { apolloClient } from "../src/data";

export default function App({ Component, pageProps }) {
    React.useEffect(() => {
        const jssStyles = document.querySelector("#jss-server-side");
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
    });

    return (
        <React.Fragment>
            <Head>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width"
                />
            </Head>
            {/* <ApolloProvider client={apolloClient}> */}
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Component {...pageProps} />
            </ThemeProvider>
            {/* </ApolloProvider> */}
        </React.Fragment>
    );
}
