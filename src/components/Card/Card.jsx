import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import {CardMedia, Tooltip} from "@mui/material";
import { i18n } from "../../ES-EN"
import { supabase } from "../../config/supabaseClient";
import Swal from "sweetalert2"
import { ModalAudio } from "../ModalAudio";

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

export default function RecipeReviewCard({ id, title, content, due, createdAt, category, audio }) {
  const [AuOpen, setAuOpen] = useState(false);
  const handleAuOpen = () => setAuOpen(true);
  const handleAuClose = () => setAuOpen(false);
  const [audioUrl, setAudioUrl] = useState("");

  const Due = <i>{i18n.t("c-due")} <Typography variant="caption">{due}</Typography></i>

  
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
  }
  
  const DeleteCard = async () =>{
    const {data, error} = await supabase
    .from("cards")
    .delete()
    .match({'id' : parseInt(id)}, {
      returning: "minimal"
    });
    if(data){
      Swal.fire({
        title: i18n.t("c-deleted-success"),
        icon: 'success'
      })
    }else{
      Swal.fire({
        title: i18n.t("c-deleted-error"),
        icon: 'error'
      });
      throw error;
    }
  }

  useEffect(() => {
    if(audio) downloadAudio(audio);
    //console.log(audio)
  }, [audio])

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
          <Tooltip title={"ID: "+id}>
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
        <audio style={{marginLeft: 20}} src={audioUrl} controls></audio>
      </CardMedia>
      <CardContent>
        {content+" "}<p><i><b>{i18n.t("c-createdAt")}</b>{createdAt}</i></p>
        <p> <i><Typography variant="caption">{category}</Typography></i></p>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="delete" onClick={() => DeleteCard()}>
          <DeleteIcon />
        </IconButton>
      </CardActions>
      
      <ModalAudio open={AuOpen} handleClose={handleAuClose} id={id} />
    </Card>
    
  );
}
