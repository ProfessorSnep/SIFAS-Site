const IS_PROD = process.env.NODE_ENV === "production";

export const image = (path) => {
    return IS_PROD
        ? `https://content.sifas.guru/${path}`
        : `http://localhost:8080/${path}`;
};

export async function newApolloClient() {
    const { ApolloClient, InMemoryCache } = await import("@apollo/client");
    return new ApolloClient({
        cache: new InMemoryCache({
            typePolicies: {
                Query: {
                    fields: {
                        cards: {
                            keyArgs: false,
                            merge(existing = [], incoming) {
                                return [...existing, ...incoming];
                            },
                        },
                    },
                },
            },
        }),
        uri: IS_PROD ? "https://api.sifas.guru/" : "http://localhost:8079/",
    });
}
