import { gql, useQuery } from "@apollo/client";
import { Grid } from "@material-ui/core";
import dynamic from "next/dynamic";
import React from "react";
import InfiniteScroll from "react-infinite-scroller";
import Layout from "../../src/components/layout";

const CardThumbnail = dynamic(() =>
    import("../../src/components/cards/thumbnail")
);

const QUERY_CARD_LIST = gql`
    query GetCards($offset: Int, $limit: Int) {
        cards(offset: $offset, limit: $limit) {
            id
            no
            rarity {
                icon
            }
            attribute {
                icon
            }
            role {
                icon
            }
            member {
                icon_colored
                color
            }
            skills {
                actives {
                    thumbnail
                    abilities {
                        base_ability {
                            short_display
                        }
                    }
                }
                passives {
                    thumbnail
                    abilities {
                        base_ability {
                            short_display
                        }
                    }
                }
            }
            stats {
                total {
                    limit_break
                    stats {
                        appeal
                        stamina
                        technique
                    }
                }
            }
            appearance {
                unidolized {
                    deck_thumbnail
                }
                idolized {
                    deck_thumbnail
                }
            }
            outfits {
                id
                name {
                    jp
                    en
                }
                thumbnail
            }
            is_fes
        }
        cardcount
    }
`;

export default function CardsList() {
    const { loading, data, fetchMore } = useQuery(QUERY_CARD_LIST, {
        variables: {
            offset: 0,
            limit: 100,
        },
    });
    console.log(data);

    return (
        <Layout title="Cards">
            <InfiniteScroll
                loadMore={(page) => {
                    if (!fetchMore) return;
                    fetchMore({
                        variables: { offset: page * 100, limit: 100 },
                    });
                    console.log("loading more...");
                }}
                page={0}
                hasMore={!loading && (data.cards.length < data.cardcount)}
                useWindow
            >
                <Grid container item spacing={3} justifyContent="center">
                    {!loading ? (
                        data.cards.map((card) => (
                            <Grid item key={card.id}>
                                <CardThumbnail card={card} idolized />
                            </Grid>
                        ))
                    ) : (
                        <Grid item>Loading...</Grid>
                    )}
                </Grid>
            </InfiniteScroll>
        </Layout>
    );
}

// export async function getStaticProps() {
//     const { newApolloClient } = await import("../../src/data");
//     const { gql } = await import("@apollo/client");

//     const apolloClient = await newApolloClient();
//     const result = await apolloClient.query({
//         query: QUERY_CARD_LIST,
//     });
//     return {
//         props: {
//             cardList: result.data.cards,
//         },
//     };
// }
