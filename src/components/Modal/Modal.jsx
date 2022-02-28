import * as React from 'react';
//import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Account from "../Account"
import { Paper } from '@mui/material';

const paperStyle = {
  padding: 20,
  height: "70vh",
  width: "340px",
  margin: "5% auto",
  borderRadius: "20px",
};

export default function BasicModal({open, handleClose, session}) {
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{zIndex: 1}}
      >
        <Paper elevation={10} style={paperStyle}>
          <Account key={session.user.id} session={session} />
          </Paper>
          
        
      </Modal>
    </div>
  );
}
