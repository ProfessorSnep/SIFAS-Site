import { gql } from "@apollo/client";
import { Grid } from "@material-ui/core";
import CardThumbnail from "../../src/components/cards/thumbnail";
import Layout from "../../src/components/layout";
import { apolloClient } from "../../src/data";

export default function CardsList({ cardList }) {
    cardList = cardList.slice().sort((c1, c2) => c1.no - c2.no);
    return (
        <Layout title="Cards">
            <Grid container item spacing={3} justifyContent="center">
                {cardList.map((card) => (
                    <Grid item key={card.id}>
                        <CardThumbnail card={card} idolized />
                    </Grid>
                ))}
            </Grid>
        </Layout>
    );
}

export async function getStaticProps() {
    const result = await apolloClient.query({
        query: QUERY_CARD_LIST,
    });
    return {
        props: {
            cardList: result.data.cards,
        },
    };
}

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
