import React, { useState, useEffect } from "react";
import PlaceHolder from "../../asset/placeholder.png";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import { CardMedia, Tooltip } from "@mui/material";
import { i18n } from "../../ES-EN";
import { supabase } from "../../config/supabaseClient";
import Swal from "sweetalert2";
import { ModalAudio } from "../ModalAudio";
import AttachFileIcon from "@mui/icons-material/AttachFile";

/*const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));*/

export default function RecipeReviewCard({
  id,
  title,
  content,
  due,
  createdAt,
  category,
  audio,
  cardImage,
}) {
  const [AuOpen, setAuOpen] = useState(false);
  const handleAuOpen = () => setAuOpen(true);
  const handleAuClose = () => setAuOpen(false);
  //const [ImgOpen, setImOpen] = useState(false);
  //const handleImgOpen = () => setImOpen(true);
  //const handleImgClose = () => setImOpen(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [ImgUrl, setImgUrl] = useState("");

  const Due = (
    <i>
      {i18n.t("c-due")} <Typography variant="caption">{due}</Typography>
    </i>
  );

  const UpdateImage = async (filePath) => {
    let { data, error } = await supabase
      .from("cards")
      .update({ cardImage: filePath })
      .match({ id: id });

    if (data) {
      Swal.fire({text: i18n.t("c-updated-image")});
    } else {
      throw error;
    }
  };

  const UploadImage = async (event) => {
    const file = event.target.files[0];
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    let { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    } else {
      UpdateImage(filePath);
    }
  };

  const downloadAudio = async (path) => {
    try {
      const { data, error } = await supabase.storage
        .from("avatars")
        .download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      setAudioUrl(url);
    } catch (error) {
      console.log("Not all cards have audio, that's why", error.message);
    }
  };

  const downloadImage = async (path) =>{
    try {
      const { data, error } = await supabase.storage
        .from("avatars")
        .download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      setImgUrl(url);
    } catch (error) {
      console.log("Not all cards have picture, that's why", error.message);
    }
  }

  const DeleteCard = async () => {
    const { data, error } = await supabase
      .from("cards")
      .delete()
      .match(
        { id: parseInt(id) },
        {
          returning: "minimal",
        }
      );
    if (data) {
      Swal.fire({
        title: i18n.t("c-deleted-success"),
        icon: "success",
      });
    } else {
      Swal.fire({
        title: i18n.t("c-deleted-error"),
        icon: "error",
      });
      throw error;
    }
  };

  useEffect(() => {
    if (audio) downloadAudio(audio);
    //console.log(audio)
  }, [audio]);

  useEffect(() =>{
    if (cardImage) downloadImage(cardImage);
    //console.log(cardImage)
  }, [cardImage]);

  return (
    <Card
      sx={{
        //maxHeight: 315 ,
        maxWidth: 345,
        marginTop: 5,
        boxShadow: 9,
        justifyContent: "space-between",
        marginLeft: 6,
      }}
    >
      <CardHeader
        avatar={
          <Tooltip title={"ID: " + id}>
            <Avatar sx={{ bgcolor: "#06776F" }} aria-label="recipe">
              !
            </Avatar>
          </Tooltip>
        }
        action={
          <IconButton onClick={handleAuOpen} aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={title}
        subheader={Due}
      />

      <CardMedia>
        {ImgUrl ? (
          <center>
            <img src={ImgUrl} alt={id} style={{ height: 200, width: 450 }}></img>
          </center>
        ) : (
          <center>
            <img
              src={PlaceHolder}
              alt={id}
              style={{ height: 100, width: 170 }}
            ></img>
          </center>
        )}

        <audio style={{ marginLeft: 20 }} src={audioUrl} controls></audio>
      </CardMedia>
      <CardContent>
        {content + " "}
        <p>
          <i>
            <b>{i18n.t("c-createdAt")}</b>
            {createdAt}
          </i>
        </p>
        <p>
          {" "}
          <i>
            <Typography variant="caption">{category}</Typography>
          </i>
        </p>
      </CardContent>
      <CardActions disableSpacing>
        <Tooltip title={i18n.t("c-delete-text")}>
          <IconButton aria-label="delete" onClick={() => DeleteCard()}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
        
          <Tooltip title={i18n.t("c-add-image")}>
            <IconButton aria-label="settings">
            <label htmlFor="imagen">
              <AttachFileIcon />
              </label>
            </IconButton>
          </Tooltip>
        <input
          style={{ visibility: "hidden", position: "absolute" }}
          type="file"
          id="imagen"
          accept="image/*"
          onChange={UploadImage}
        />
      </CardActions>
      <ModalAudio open={AuOpen} handleClose={handleAuClose} id={id} />
    </Card>
  );
}
