import {
    AppBar,
    Divider,
    Drawer,
    Hidden,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    makeStyles,
    Toolbar,
    Typography
} from "@material-ui/core";
import {
    Event,
    Home,
    LocalMall,
    Menu,
    MenuBook,
    MusicVideo,
    RecentActors
} from "@material-ui/icons";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const drawerWidth = 180;

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    toolbar: theme.mixins.toolbar,
}));

function NavDrawer({ mobileOpen, onClose, children, className, classes }) {
    return (
        <React.Fragment>
            <Hidden smDown>
                <Drawer
                    className={className}
                    classes={classes}
                    variant="permanent"
                    anchor="left"
                >
                    {children}
                </Drawer>
            </Hidden>
            <Hidden mdUp>
                <Drawer
                    className={className}
                    classes={classes}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={onClose}
                >
                    {children}
                </Drawer>
            </Hidden>
        </React.Fragment>
    );
}

function NavItem({ href, icon, name, sub }) {
    return (
        <Link href={href} passHref>
            <ListItem button component="a">
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={name} secondary={sub} />
            </ListItem>
        </Link>
    );
}

export default function Layout({ children, title, description, image }) {
    const classes = useStyles();
    const router = useRouter();

    const [mobileOpen, setMobileOpen] = React.useState(false);

    return (
        <div className={classes.root}>
            <Head>
                <title>{"SIFAS.Guru" + (title ? " - " + title : "")}</title>
                <meta name="description" value={description} />
                <meta property="og:site_name" content="SIFAS.Guru" />
                <meta property="og:title" content={title || "Home"} />
                <meta property="og:type" content="website" />
                <meta
                    property="og:url"
                    content={"https://sifas.guru" + router.asPath}
                />
                <meta property="og:image" content="" />
                <meta property="og:description" content={description} />
            </Head>
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <Hidden mdUp>
                        <IconButton
                            color="inherit"
                            aria-label="Open drawer"
                            edge="start"
                            onClick={() => setMobileOpen(true)}
                        >
                            <Menu />
                        </IconButton>
                    </Hidden>
                    <Typography variant="h6">SIFAS.Guru</Typography>
                </Toolbar>
            </AppBar>
            <NavDrawer
                mobileOpen={mobileOpen}
                className={classes.drawer}
                classes={{ paper: classes.drawerPaper }}
                onClose={() => setMobileOpen(false)}
            >
                <div className={classes.toolbar} />
                <List>
                    <NavItem href="/" name="Home" icon={<Home />} />
                </List>
                <Divider />
                <List>
                    <NavItem
                        href="/cards"
                        name="Cards"
                        icon={<RecentActors />}
                    />
                    <NavItem href="/lives" name="Lives" icon={<MusicVideo />} />
                    <NavItem
                        href="/accessories"
                        name="Accessories"
                        icon={<LocalMall />}
                    />
                </List>
                <Divider />
                <List>
                    <NavItem href="/events" name="Events" icon={<Event />} />
                    <NavItem
                        href="/stories"
                        name="Stories"
                        icon={<MenuBook />}
                    />
                </List>
            </NavDrawer>
            <div className={classes.content}>
                <div className={classes.toolbar} />
                <main>{children}</main>
            </div>
        </div>
    );
}
