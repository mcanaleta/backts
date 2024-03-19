import CalendarMonth from "@mui/icons-material/CalendarMonth";
import LogoutIcon from "@mui/icons-material/Logout";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { ElementType } from "react";
import { Link } from "react-router-dom";
import { BackTsProps } from "..";

function MenuItem({
  icon,
  text,
  href,
}: {
  icon: ElementType;
  text: string;
  href: string;
}) {
  const Icon = icon;
  return (
    <ListItem key={href} disablePadding>
      <ListItemButton component={Link} to={href}>
        <ListItemIcon>
          <Icon />
        </ListItemIcon>
        <ListItemText primary={text} />
      </ListItemButton>
    </ListItem>
  );
}

export function DHDrawer(props: { width: number } & BackTsProps) {
  return (
    <Drawer
      sx={{
        width: props.width,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: props.width,
          boxSizing: "border-box",
          top: ["48px", "56px", "64px"],
          height: "auto",
          bottom: 0,
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Divider />
      <List>
        {/* <MenuItem icon={HomeIcon} text="Home" href="/" /> */}
        {/* <MenuItem icon={CalendarMonth} text="Episodes" href="/episodes" />
        <MenuItem icon={PodcastsIcon} text="Shows" href="/shows" />
        <MenuItem icon={PodcastsIcon} text="Ivoox" href="/ivoox" /> */}
        {props.pages.map((page) => (
          <MenuItem
            key={page.path}
            icon={CalendarMonth}
            text={page.title}
            href={page.path}
          />
        ))}
        {/* <MenuItem icon={PodcastsIcon} text="Podcasts" href="/podcasts" /> */}
        {/* <MenuItem icon={MailIcon} text="TOP 25" href="/top25" /> */}
        {/* <MenuItem icon={MailIcon} text="Schedule" href="/schedule" /> */}
      </List>
      <Divider sx={{ mt: "auto" }} />
      <List>
        <MenuItem icon={LogoutIcon} text="Sign Out" href="/api/auth/signout" />
      </List>
    </Drawer>
  );
}
