import { Link as MuiLink } from "@mui/material";
import { ReactNode } from "react";
import { Link as ReactLink } from "react-router-dom";

export function Link(props: { to: string; children: ReactNode }) {
  return (
    <MuiLink component={ReactLink} to={props.to}>
      {props.children}
    </MuiLink>
  );
}
