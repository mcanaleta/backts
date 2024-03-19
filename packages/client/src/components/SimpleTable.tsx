import TableBody from "@mui/material/TableBody";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

type RowType = {
  id: string;
};

export type SimpleTableColumn<T extends RowType> = {
  label: string;
  f: (row: T) => any;
};

export type SimpleTableAction<T extends RowType> = {
  label: string;
  f?: (row: T) => void;
  link?: (row: T) => string;
};

export function SimpleTable<T extends RowType>({
  rows,
  cols,
  actions = [],
}: {
  rows: T[];
  cols: SimpleTableColumn<T>[];
  actions?: SimpleTableAction<T>[];
}) {
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          {cols.map((col) => (
            <TableCell key={col.label}>{col.label}</TableCell>
          ))}
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.id}>
            {cols.map((col) => (
              <TableCell key={col.label}>{col.f(row)}</TableCell>
            ))}
            <TableCell>
              {actions.map((action) =>
                action.f ? (
                  <Button key={action.label} onClick={() => action.f!(row)}>
                    {action.label}
                  </Button>
                ) : action.link ? (
                  <Link
                    key={"link-" + action.label}
                    to={action.link(row)}
                    target="_blank"
                  >
                    <Button>{action.label}</Button>
                  </Link>
                ) : (
                  <Button key={"empty-" + action.label}>{action.label}</Button>
                )
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
