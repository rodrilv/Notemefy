import React, { Fragment, useState, useEffect } from "react";
import AudioReactRecorder, { RecordState } from "audio-react-recorder";
import {
  Modal,
  Paper,
  Button,
  Grid,
  Divider,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import { supabase } from "../../config/supabaseClient";
import { i18n } from "../../ES-EN";
import Swal from "sweetalert2";

export default function Audio({ open, handleClose, id }) {
  const [state, setState] = useState({
    recordState: null,
  });
  const [categories, setCategories] = useState([]);
  
  const [audio, setAudio] = useState({});
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const GetCategory = async () => {
    let user = supabase.auth.user();
    const { data, error } = await supabase.from("categories")
    .select("*")
    .match({userid: user.id});

    if (data) {
      setCategories(data);
      //console.log(category);
    } else {
      throw error;
    }
  };

  const UpdateCategory = async () => {
    setLoading(true);
    if (category === "" || category === undefined) {
      Swal.fire({ title: i18n.t("a-warning-category"), icon: "warning" });
      setLoading(false);
    } else {
      const { data, error } = await supabase
        .from("cards")
        .update({ category: category })
        .match({ id: id });

      if (data) {
        setLoading(false);
        Swal.fire({ title: i18n.t("a-updated-category"), icon: "success" });
        
      } else {
        setLoading(false);
        Swal.fire({ title: i18n.t("a-error-category"), icon: "error" });
        
        throw error;
      }
    }
  };

  const paperStyle = {
    padding: 20,
    height: "70vh",
    width: 510,
    margin: "90px auto",
    borderRadius: "20px",
  };

  const start = () => {
    setState({
      recordState: RecordState.START,
    });
  };

  const stop = () => {
    setState({
      recordState: RecordState.STOP,
    });
  };

  const onStop = (audioData) => {
    console.log("audioData", audioData);
    setAudio(audioData);
  };

  const uploadAudio = async (event) => {

    const file = event.target.files[0];
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    let { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }else{
      saveAudio(filePath);
    }
  };

  const saveAudio = async (filePath) => {  
    let { data, error} = await supabase
    .from("cards")
    .update({ audio: filePath})
    .match({id: id});

    if(data){
      Swal.fire("Upload Completed");
     
    }else{
      
      throw error;
    }
    
  };

  

  useEffect(() => {
    //console.log(audio);
  }, [audio]);

  useEffect(() => {
    GetCategory();
  }, []);

  const { recordState } = state;

  return (
    <Fragment>
      <Modal
        style={{ zIndex: 1 }}
        open={open}
        onClose={handleClose}
        elevation={10}
      >
        <Paper style={paperStyle}>
          <Grid align="center">
            <div>
              <AudioReactRecorder state={recordState} onStop={onStop} />
              <audio src={audio.url} controls></audio>
              <br></br>
              <Button variant="contained" onClick={start}>
                {i18n.t("a-btn-start")}
              </Button>
              <Button variant="contained" onClick={ () => { stop(); Swal.fire({text: i18n.t("a-advice-stop")}) }}>
                {i18n.t("a-btn-stop")}
              </Button>
              <Button variant="contained">
                <label htmlFor="audio">
                  {i18n.t("a-btn-upload")}
                </label>
                </Button>
                <input 
                style={{visibility: "hidden", position: "absolute"}}
                type="file"
                id="audio"
                accept="audio/*"
                onChange={uploadAudio}
                
                />
            </div>

            <Divider style={{ marginTop: 10 }} />

            <Box sx={{ minWidth: 120, marginTop: 2 }}>
              <FormControl>
                <InputLabel id="demo-simple-select-label">
                  {i18n.t("d-select-category")}
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={category}
                  label="Category"
                  onChange={(e) => {
                    setCategory(e.target.value);
                  }}
                  //onChange={console.log("Yay! I´ve changed")}
                >
                  {categories &&
                    categories.map((ct, index) => (
                      <MenuItem key={index} value={ct.category}>
                        {ct.category}
                      </MenuItem>
                    ))}
                </Select>

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
                      UpdateCategory();
                    }}
                    style={{ marginTop: 35, height: 70 }}
                    variant="contained"
                  >
                    {i18n.t("a-btn-update")}
                  </Button>
                )}
              </FormControl>
            </Box>
          </Grid>
        </Paper>
      </Modal>
    </Fragment>
  );
}
