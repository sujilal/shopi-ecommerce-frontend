import React from "react";
import {
    Box,
    Container,
    Typography,
    Grid,
    Link,
    Divider,
    Paper,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import "./Footer.scss";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: "#f5f5f5",
                borderTop: "1px solid #e0e0e0",
                mt: "auto",
            }}
        >
            <Container maxWidth="lg" sx={{ py: 6 }}>
                <Grid container spacing={4} sx={{ mb: 4 }}>

                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                            About Shopi
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ lineHeight: 1.8 }}>
                            Your one-stop shopping destination for quality products at great prices.
                        </Typography>
                    </Grid>


                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                            Quick Links
                        </Typography>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            <Link href="#" underline="none" sx={{ color: "text.secondary", "&:hover": { color: "primary.main" } }}>
                                Home
                            </Link>
                            <Link href="#" underline="none" sx={{ color: "text.secondary", "&:hover": { color: "primary.main" } }}>
                                Products
                            </Link>
                        </Box>
                    </Grid>


                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                            Customer Service
                        </Typography>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            <Link href="#" underline="none" sx={{ color: "text.secondary", "&:hover": { color: "primary.main" } }}>
                                Contact Us
                            </Link>

                            <Link href="#" underline="none" sx={{ color: "text.secondary", "&:hover": { color: "primary.main" } }}>
                                Shipping Info
                            </Link>

                        </Box>
                    </Grid>


                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                            Follow Us
                        </Typography>
                        <Box sx={{ display: "flex", gap: 2 }}>
                            <Link href="#" sx={{ color: "text.secondary", "&:hover": { color: "primary.main" } }}>
                                <FacebookIcon />
                            </Link>
                            <Link href="#" sx={{ color: "text.secondary", "&:hover": { color: "primary.main" } }}>
                                <TwitterIcon />
                            </Link>
                            <Link href="#" sx={{ color: "text.secondary", "&:hover": { color: "primary.main" } }}>
                                <InstagramIcon />
                            </Link>
                            <Link href="#" sx={{ color: "text.secondary", "&:hover": { color: "primary.main" } }}>
                                <LinkedInIcon />
                            </Link>
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />


                <Box sx={{ textAlign: "center", pt: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                        © {currentYear} Shopi. All rights reserved.
                    </Typography>
                    <Box sx={{ mt: 1, display: "flex", justifyContent: "center", gap: 2 }}>
                        <Link href="#" underline="none" variant="body2" sx={{ color: "text.secondary", "&:hover": { color: "primary.main" } }}>
                            Privacy Policy
                        </Link>
                        <Typography variant="body2" color="textSecondary">|</Typography>
                        <Link href="#" underline="none" variant="body2" sx={{ color: "text.secondary", "&:hover": { color: "primary.main" } }}>
                            Terms of Service
                        </Link>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
