// import { useGlobalContext } from "@client/contexts/global.context";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { BackTsProps } from "..";
import { useGlobalContext } from "@client/contexts/global.context";
import { Box, IconButton, LinearProgress, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AccountMenu from "./accountmenu";
import { Search } from "./search";

export function Header(props: BackTsProps) {
  const { loading } = useGlobalContext();
  return (
    <AppBar position="fixed" sx={{ zIndex: 2000 }}>
      <Toolbar sx={{ backgroundColor: "background.paper" }}>
        <DashboardIcon
          sx={{ color: "#444", mr: 2, transform: "translateY(-2px)" }}
        />
        <Typography variant="h6" noWrap component="div" color="black">
          {props.title}
        </Typography>

        {/* <TextField
          variant="outlined"
          size="small"
          placeholder="Search..."
          sx={{ flexGrow: 1, mx: 10 }}
          InputProps={{
            endAdornment: (
              <IconButton type="submit" aria-label="search">
                <SearchIcon />
              </IconButton>
            ),
          }}
        /> */}
        <Box sx={{ width: "50px" }} />
        <Search />
        <Box sx={{ flexGrow: 1 }} />

        {/* <Typography color="black">{`${user?.email} / ${claims?.role} / ${user?.uid}`}</Typography> */}
        <AccountMenu />
      </Toolbar>
      {loading && <LinearProgress />}
    </AppBar>
  );
}
