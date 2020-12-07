import { Grid } from "@material-ui/core";
import dynamic from "next/dynamic";
import React from "react";
import InfiniteScroll from "react-infinite-scroller";
import Layout from "../../src/components/layout";

const CardThumbnail = dynamic(() =>
    import("../../src/components/cards/thumbnail")
);

export default function CardsList({ cardList }) {
    cardList = cardList.slice().sort((c1, c2) => c1.no - c2.no);
    const [numCards, setNumCards] = React.useState(99);

    return (
        <Layout title="Cards">
            <InfiniteScroll
                loadMore={() => setNumCards((num) => num + 100)}
                hasMore={numCards < cardList.length}
                useWindow
            >
                <Grid container item spacing={3} justifyContent="center">
                    {cardList.slice(0, numCards).map((card) => (
                        <Grid item key={card.id}>
                            <CardThumbnail card={card} idolized />
                        </Grid>
                    ))}
                </Grid>
            </InfiniteScroll>
        </Layout>
    );
}

export async function getStaticProps() {
    const { newApolloClient } = await import("../../src/data");
    const { gql } = await import("@apollo/client");
    const QUERY_CARD_LIST = gql`
        query {
            cards {
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
        }
    `;
    const apolloClient = await newApolloClient();
    const result = await apolloClient.query({
        query: QUERY_CARD_LIST,
    });
    return {
        props: {
            cardList: result.data.cards,
        },
    };
}
