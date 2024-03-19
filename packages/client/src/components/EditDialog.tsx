import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useFormikContext } from "formik";

export function EditDialog(props: {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
}) {
  const { submitForm } = useFormikContext();

  return (
    <Dialog
      fullWidth={true}
      maxWidth="lg"
      open={true}
      scroll="paper"
      onClose={() => {
        // setEditingShow(undefined);
      }}
    >
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent
        style={{
          maxHeight: "70vh",
        }}
      >
        {props.children}

        {/* <ShowForm show={editingShow} setShow={setEditingShow} /> */}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => submitForm()}
          variant={"contained"}
          color={"primary"}
        >
          Save
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => props.onClose()}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
