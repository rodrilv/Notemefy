import React, { Fragment } from "react";
import { Paper, Button, Grid, Divider, Modal } from "@mui/material";

export default function ModalImage({open, handleClose, id}) {
  const paperStyle = {
    padding: 20,
    height: "70vh",
    width: 510,
    margin: "90px auto",
    borderRadius: "20px",
  };
  
  return (
    <Fragment>
      <Modal open={open} onClose={handleClose} style={{ zIndex: 1 }}>
        <Paper elevation={8} style={ paperStyle }>

        </Paper>
      </Modal>
    </Fragment>
  );
}
