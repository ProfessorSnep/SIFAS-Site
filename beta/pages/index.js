import { Grid, Typography } from "@material-ui/core";
import Layout from "../src/components/layout";

export default function Home() {
    return (
        <Layout description="Fan-run content information hub for Love Live! School Idol Festival ALL STARS (SIFAS)">
            <Grid container justifyContent="space-evenly">
                <Grid item xs style={{ textAlign: "center" }}>
                    <Typography variant="h3">Welcome!</Typography>
                    <Typography variant="subtitle1">
                        This is a test redesign, very much work in progress.
                    </Typography>
                </Grid>
            </Grid>
        </Layout>
    );
}
