// import { useGlobalContext } from "@client/contexts/global.context";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { BackTsProps } from "..";
import { useGlobalContext } from "@client/contexts/global.context";

export function Header(props: BackTsProps) {
  const { user, logout, claims } = useGlobalContext();
  return (
    <AppBar position="fixed" sx={{ zIndex: 2000 }}>
      <Toolbar sx={{ backgroundColor: "background.paper" }}>
        <DashboardIcon
          sx={{ color: "#444", mr: 2, transform: "translateY(-2px)" }}
        />
        <Typography variant="h6" noWrap component="div" color="black">
          {props.title}
        </Typography>

        {/* <Button
          variant="contained"
          href="/auth/signin"
          style={{ marginLeft: 30 }}
        >
          login
        </Button> */}
        <Typography sx={{ flex: 1 }} />
        <Typography color="black">{`${user?.email} / ${claims?.role}`}</Typography>

        <Button
          variant="contained"
          style={{ marginLeft: 30 }}
          onClick={() => logout()}
        >
          LOGOUT
        </Button>
      </Toolbar>
    </AppBar>
  );
}
