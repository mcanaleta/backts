import { DHDrawer } from "@client/sections/drawer";
import { Header } from "@client/sections/header";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { Outlet } from "react-router-dom";
import { BackTsProps, useGlobalContext } from ".";
// import { Outlet } from "react-router-dom";

const DRAWER_WIDTH = 240;
export default function Layout(props: BackTsProps) {
  return (
    <>
      <CssBaseline />
      <Header {...props} />
      <DHDrawer width={DRAWER_WIDTH} {...props} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          ml: `${DRAWER_WIDTH}px`,
          mt: ["48px", "56px", "52px"],
          p: 3,
        }}
      >
        <Outlet />
      </Box>
    </>
  );
}
