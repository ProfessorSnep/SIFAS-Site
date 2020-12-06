import { Grid, Typography } from "@material-ui/core";
import Layout from "../src/components/layout";

export default function Home() {
    return (
        <Layout description="Fan-run content information hub for Love Live! School Idol Festival ALL STARS (SIFAS)">
            <Grid container justifyContent="space-evenly">
                <Grid item xs style={{ textAlign: "center" }}>
                    <Typography variant="h3">Welcome!</Typography>
                    <Typography variant="subtitle1">
                        This is where I keep my things
                    </Typography>
                </Grid>
                <Grid container item justifyContent="space-around">
                    <Grid item>
                        <h2>Test</h2>
                    </Grid>
                    <Grid item>
                        <h3>Test</h3>
                    </Grid>
                </Grid>
            </Grid>
        </Layout>
    );
}
