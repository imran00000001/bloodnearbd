import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#7A1128",
      main2: "#A32638",
    },
    secondary: {
      main: "#E8A33D",
    },

    bgolor: {
      main: "linear-gradient(45deg, #7A1128 30%, #E8A33D 90%)",
    },
    error: {
      main: "#B33951",
    },
    // Very light reddish-pink instead of plain white, site-wide.
    // MUI's <CssBaseline /> sets the <body> background from this value,
    // so this has to be set here too or CssBaseline overrides the plain
    // CSS rule in index.css back to white.
    background: {
      default: "#FFF1F2",
    },
  },
  typography: {
    fontFamily: "'Manrope', 'Noto Sans Bengali', sans-serif",
  },
});

export default theme;
