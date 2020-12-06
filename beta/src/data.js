import { ApolloClient, InMemoryCache } from "@apollo/client";

const IS_PROD = process.env.NODE_ENV === "production";

export const image = (path) => {
    return IS_PROD ? `https://content.sifas.guru/${path}` : `http://localhost:8080/${path}`
}

export const apolloClient = new ApolloClient({
    cache: new InMemoryCache(),
    uri: IS_PROD ? "https://api.sifas.guru/" : "http://localhost:8079/",
});
