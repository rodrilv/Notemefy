import React, { useState, useEffect, useCallback } from "react";

import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import ListItemIcon from "@mui/material/ListItemIcon";
//import Divider from '@mui/material/Divider';
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
//import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { Button, ButtonGroup } from "@mui/material";
import { Modal } from "../Modal";
import { ModalCards } from "../ModalCards";
import { supabase } from "../../config/supabaseClient";
import { i18n } from "../../ES-EN";
import Swal from "sweetalert2";

export default function AccountMenu({ session }) {
  const [username, setUsername] = useState("");
  const [Image, setImage] = useState("");
  const [ImageUrl, setImageUrl] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [openModal, setOpen] = useState(false);
  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);

  const [openModalAdd, setOpenAdd] = useState(false);
  const handleOpenModalAdd = () => setOpenAdd(true);
  const handleCloseModalAdd = () => setOpenAdd(false);

  const ObtainUsername = useCallback(async () => {
    const user = supabase.auth.user();
    const { data, error } = await supabase
      .from("profiles")
      .select("username, avatar_url")
      .eq("id", user.id)
      .single();

    if (data) {
      setUsername(data.username);
      setImageUrl(data.avatar_url);
    } else if (!error) {
      throw error;
    }
  }, []);

  const ObtainImage = useCallback(async () => {
    const { data, error } = await supabase.storage
      .from("avatars")
      .download(ImageUrl);

    if (data) {
      const url = URL.createObjectURL(data);
      setImage(url);
    } else if (!error) {
      console.log("Hubo un error durante la descarga");
      throw error;
    }
  }, [ImageUrl]);

  const changeLanguage = () => {
    if (window.localStorage.getItem("i18nextLng") === "es-ES") {
      window.localStorage.setItem("i18nextLng", "en-EN");
      Swal.fire(i18n.t("refresh"));
    } else {
      window.localStorage.setItem("i18nextLng", "es-ES");
      Swal.fire(i18n.t("refresh"));
    }
  };

  useEffect(() => {
    ObtainUsername();
    ObtainImage();
  }, [ImageUrl, ObtainImage, ObtainUsername]);

  return (
    <React.Fragment>
      <Typography sx={{ minWidth: 100, marginLeft: 4 }}>{username}</Typography>
      <Tooltip title={i18n.t("d-tooltip-avatar")}>
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <Avatar sx={{ width: 80, height: 80 }} src={Image}></Avatar>
        </IconButton>
      </Tooltip>

      <Tooltip title={i18n.t("d-tooltip-add")}>
        <IconButton
          onClick={handleOpenModalAdd}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <Avatar sx={{ width: 32, height: 32 }}>+</Avatar>
        </IconButton>
      </Tooltip>

      <ButtonGroup
        style={{ marginLeft: 15 }}
        color="primary"
        variant="outlined"
        aria-label="outlined button group"
      >
        <Button variant="outlined" onClick={() => changeLanguage()}>
          ES | EN
        </Button>
      </ButtonGroup>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 20,
          sx: {
            backgroundColor: "white",
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "white",
              transform: " translateX(-220%) translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleOpenModal}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          {i18n.t("config")}
        </MenuItem>
        <MenuItem
          onClick={() => {
            supabase.auth.signOut();
          }}
        >
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
      <Modal
        session={session}
        open={openModal}
        //handleOpen={handleOpenModal}
        handleClose={handleCloseModal}
      />
      <ModalCards
        open={openModalAdd}
        handleClose={handleCloseModalAdd}
        session={session}
      />
    </React.Fragment>
  );
}
