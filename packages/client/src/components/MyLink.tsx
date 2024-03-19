import { Link } from "@mui/material";
import { ReactNode } from "react";
import { Link as ReactLink } from "react-router-dom";

export function MyLink(props: { to: string; children: ReactNode }) {
  return (
    <Link component={ReactLink} to={props.to}>
      {props.children}
    </Link>
  );
}
