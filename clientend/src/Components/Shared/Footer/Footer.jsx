import { BloodtypeTwoTone, Facebook } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { blueGrey } from "@mui/material/colors";

const Footer = () => {
    return (
        <>
            <Box display={"md:flex"} color={'primary.main'} justifyContent={"space-between"}
                sx={{ textAlign: "center", bgcolor: blueGrey[800], color: 'primary.main', p: 3 }}>

                <BloodtypeTwoTone sx={{
                    fontSize: "60px",
                    color: "red",
                    animation: 'ease-in',

                }} />
                <Box>
                    <Typography variant="body1">
                        <span style={{ color: "#A32638" }}>BloodNear</span>{" "}
                        <span style={{ color: "#2E7D32" }}>BD</span>
                    </Typography>
                </Box>

                <Box sx={{
                    my: 3, "& svg": {
                        fontSize: '40px',
                        cursor: 'pointer',
                        mr: 2,
                    },
                    "& svg:hover": {
                        color: "secondary.main",
                        transform: 'translateY(10px)',
                        transition: "all 400ms",
                    }
                }} >

                    <a
                        href="https://www.facebook.com/imranhossain.august2"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Facebook"
                    >
                        <Facebook />
                    </a>
                </Box>


                <Typography variant="body1">

                    All Rights Reserved &copy; BloodNear BD
                </Typography>


            </Box>

        </>
    );
};

export default Footer;
