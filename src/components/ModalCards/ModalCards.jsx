
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { supabase } from "../../config/supabaseClient";
import Swal from "sweetalert2";
import { i18n } from "../../ES-EN";
import { Button, Divider, TextField, Typography } from "@mui/material";
import { Paper, Grid, CircularProgress } from "@mui/material";

const card = {
  id: "",
  title: "",
  content: "",
  due: "",
  created_at: "",
  userid: "",
};

const paperStyle = {
  padding: 20,
  height: "70vh",
  width: 320,
  margin: "90px auto",
  borderRadius: "20px",
};

export default function BasicModalCards({ open, handleClose, session }) {
  const [id, setId] = useState();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [due, setDue] = useState("");
  const [loading, setLoading] = useState(false);

  const createDate = () => {
    let d = new Date();
    let DATE =
      d.getDay() +
      "-" +
      d.getMonth() +
      "-" +
      d.getFullYear() +
      " @ " +
      d.getHours() +
      ":";
    if (d.getMinutes() < 10) {
      DATE = DATE + "0" + d.getMinutes();
    } else {
      DATE = DATE + d.getMinutes();
    }
    return DATE;
  };

  const GetId = async () => {
    let { data, error } = await supabase
      .from("cards")
      .select("id")
      .single()
      .limit(1);

    if (data) {
      //console.log("Si devolví datos: ", data)
      setId( parseInt((Math.random)* 100) + parseInt(data.id + 1) );
    } else {
      throw error;
    }
  };

  const SendCard = async (title, content, due) => {
    setLoading(true);
    const user = supabase.auth.user();

    if (title === "" || content === "" || due === "") {
      Swal.fire({
        title: i18n.t("nc-fill-error"),
        icon: "error",
      });
      setLoading(false);
    } else {
      card.id = id;
      card.title = title;
      card.content = content;
      card.due = due;
      card.created_at = createDate();
      card.userid = user.id;
      let { data, error } = await supabase.from("cards").insert(card);
      if (!data) {
        //console.log(card);
        setLoading(false);

        throw error;
      } else {
        setLoading(false);
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    }
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ zIndex: 1 }}
      >
        <Paper elevation={10} style={paperStyle}>
          <Grid align="center">
            <Typography sx={{ marginTop: 3 }} variant="h4">
              {i18n.t("nc-header")}
            </Typography>
            <Divider style={{ marginTop: 15 }} />
            <div style={{ marginTop: 35 }}>
              <TextField
                id="title"
                type="text"
                label="Title"
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <TextField
                id="content"
                label="Content"
                type="text"
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            <div>
              <TextField
                id="due"
                type="date"
                onChange={(e) => setDue(e.target.value)}
              />
            </div>

            <div>
              {loading ? (
                <Button
                  disabled
                  style={{ marginTop: 35, height: 70, width: 161 }}
                  variant="contained"
                >
                  <Box sx={{ display: "flex" }}>
                    <CircularProgress />
                  </Box>
                </Button>
              ) : (
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    GetId();
                    SendCard(title, content, due);
                  }}
                  style={{ marginTop: 35, height: 70 }}
                  variant="contained"
                >
                  {i18n.t("nc-save")}
                </Button>
              )}
            </div>

            <div></div>
          </Grid>
        </Paper>
      </Modal>
    </div>
  );
}
