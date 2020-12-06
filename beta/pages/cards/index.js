import { gql, useQuery } from "@apollo/client";
import { Grid } from "@material-ui/core";
import CardThumbnail from "../../src/components/cards/thumbnail";
import Layout from "../../src/components/layout";

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
            is_fes
        }
    }
`;

export default function CardsList() {
    const { loading, data } = useQuery(QUERY_CARD_LIST);

    var cardList = [];
    if (!loading) {
        cardList = data.cards.slice();
        cardList = cardList.sort((c1, c2) => c1.no - c2.no);
    }
    return (
        <Layout title="Cards">
            <Grid container>
                {loading ? (
                    <Grid item>Loading...</Grid>
                ) : (
                    <Grid container item spacing={3}>
                        {cardList.map((card) => (
                            <Grid item key={card.id}>
                                <CardThumbnail cardObj={card} idolized />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Grid>
        </Layout>
    );
}
