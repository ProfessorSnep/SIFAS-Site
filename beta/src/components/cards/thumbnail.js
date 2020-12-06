import { gql, useQuery } from "@apollo/client";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Collapse,
    Grid,
    IconButton,
    makeStyles,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import React from "react";
import { image } from "../../data";

const QUERY_CARD_THUMBNAIL = gql`
    query GetCard($cardId: Int) {
        card(id: $cardId) {
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
                }
                passives {
                    thumbnail
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

const useStyles = makeStyles((theme) => ({
    card: {
        borderRadius: 20,
        borderRight: 3,
        borderRightStyle: "solid",
    },
    content: {
        padding: 8,
        width: 150,
        height: "100%",
    },
    fullHeight: {
        height: "100%",
    },
    cardMedia: {
        width: 100,
        height: 175,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
    },
    rarityIcon: {
        width: 50,
        height: 40,
        padding: 2,
    },
    squareIcon: {
        width: 40,
        height: 40,
        padding: 2,
    },
    skillIcon: {
        width: 35,
        height: 35,
        marginLeft: 2,
    },
    fesIcon: {
        width: 60,
        height: 30,
    },
    number: {
        paddingTop: 5,
    },
    expandButton: {
        transform: "rotate(0deg)",
        transition: theme.transitions.create("transform", {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandButtonOpen: {
        transform: "rotate(180deg)",
    },
    expandedContainer: {
        paddingTop: 5,
    },
}));

export default function CardThumbnail({ cardId, cardObj, idolized }) {
    const { loading, data } = useQuery(QUERY_CARD_THUMBNAIL, {
        variables: { cardId },
        skip: cardObj !== undefined,
    });
    const classes = useStyles();

    const [expanded, setExpanded] = React.useState(false);

    const card = cardObj || (data && data.card);

    return loading ? (
        <span>Loading...</span>
    ) : (
        <Card
            className={classes.card}
            style={{ borderRightColor: "#" + card.member.color }}
            elevation={5}
        >
            <Grid container>
                <Grid item>
                    <CardMedia
                        image={
                            card.appearance[
                                idolized ? "idolized" : "unidolized"
                            ].deck_thumbnail
                        }
                        className={classes.cardMedia}
                    />
                </Grid>
                <Grid item>
                    <CardContent className={classes.content}>
                        <Grid container className={classes.fullHeight}>
                            <Grid container item justifyContent="space-around">
                                <Grid item xs={"auto"}>
                                    <img
                                        className={classes.rarityIcon}
                                        src={card.rarity.icon}
                                    />
                                </Grid>
                                <Grid item>
                                    <img
                                        className={classes.squareIcon}
                                        src={card.attribute.icon}
                                    />
                                </Grid>
                                <Grid item>
                                    <img
                                        className={classes.squareIcon}
                                        src={card.role.icon}
                                    />
                                </Grid>
                            </Grid>
                            <Grid
                                container
                                item
                                justifyContent="center"
                                spacing={2}
                            >
                                <Grid item>
                                    {card.skills.actives.map(
                                        (active, index) => (
                                            <img
                                                key={index}
                                                src={active.thumbnail}
                                                className={classes.skillIcon}
                                                title={active.abilities
                                                    .map(
                                                        (abil) =>
                                                            abil.base_ability
                                                                .short_display
                                                    )
                                                    .join("\n")}
                                            />
                                        )
                                    )}
                                </Grid>
                                <Grid item>
                                    {card.skills.passives.map(
                                        (active, index) => (
                                            <img
                                                key={index}
                                                src={active.thumbnail}
                                                className={classes.skillIcon}
                                                title={active.abilities
                                                    .map(
                                                        (abil) =>
                                                            abil.base_ability
                                                                .short_display
                                                    )
                                                    .join("\n")}
                                            />
                                        )
                                    )}
                                </Grid>
                            </Grid>
                            <Grid
                                container
                                item
                                justifyContent="space-between"
                                alignItems="flex-end"
                                spacing={1}
                            >
                                <Grid item>
                                    {card.is_fes ? (
                                        <img
                                            src={image("ui/fes.png")}
                                            className={classes.fesIcon}
                                        />
                                    ) : undefined}
                                </Grid>
                            </Grid>
                        </Grid>
                    </CardContent>
                    <CardActions />
                </Grid>
                <Grid item>
                    <Grid
                        container
                        direction="column"
                        justifyContent="space-between"
                        spacing={1}
                        className={classes.fullHeight}
                    >
                        <Grid item>
                            <Typography
                                variant="body2"
                                align="center"
                                className={classes.number}
                            >
                                {"#" + card.no}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <IconButton
                                className={
                                    classes.expandButton +
                                    (expanded
                                        ? " " + classes.expandButtonOpen
                                        : "")
                                }
                                onClick={() => setExpanded(!expanded)}
                            >
                                <ExpandMore />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Collapse in={expanded}>
                <Grid container className={classes.expandedContainer}>
                    <Grid item xs={12}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">
                                        <img
                                            src={image(
                                                "ui/ui_cardintroduction_parts_exceed_1.png"
                                            )}
                                            width={18}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <img
                                            src={image(
                                                "ui/ui_common_icon_parameter_1.png"
                                            )}
                                            width={18}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <img
                                            src={image(
                                                "ui/ui_common_icon_parameter_2.png"
                                            )}
                                            width={18}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <img
                                            src={image(
                                                "ui/ui_common_icon_parameter_3.png"
                                            )}
                                            width={18}
                                        />
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {card.stats.total.map((stat) =>
                                    stat.limit_break === 0 ||
                                    stat.limit_break === 5 ? (
                                        <TableRow key={stat.limit_break}>
                                            <TableCell align="center">
                                                {stat.limit_break}
                                            </TableCell>
                                            <TableCell align="center">
                                                {stat.stats.appeal}
                                            </TableCell>
                                            <TableCell align="center">
                                                {stat.stats.stamina}
                                            </TableCell>
                                            <TableCell align="center">
                                                {stat.stats.technique}
                                            </TableCell>
                                        </TableRow>
                                    ) : undefined
                                )}
                            </TableBody>
                        </Table>
                    </Grid>
                </Grid>
            </Collapse>
        </Card>
    );
}
