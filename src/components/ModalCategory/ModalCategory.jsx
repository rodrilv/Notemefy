import { Modal, TextField, Paper, Button, Grid } from "@mui/material";
import React, {useState} from "react";
import { supabase } from "../../config/supabaseClient"
import { i18n } from "../../ES-EN";
import Swal from "sweetalert2"

export default function ModalCategory({ open, handleClose }) {
    const [_id, setId] = useState('');
    const [category, setCategory] = useState('');

    const GetIdCategory = async () =>{
        let { data, error } = await supabase
        .from("categories")
        .select("id")
        .limit(1)
        .single()

        if(data){
            setId(data.id)
            console.log(_id)
        }else{
            throw error;
        }
    }
    const addCategory = async () =>{
        GetIdCategory();
        let { data, error } = await supabase 
        .from("categories")
        .insert([
            { id: parseInt(_id) + 2 + parseInt(Math.random()*100), category: category }
          ]);

        if(data){
            Swal.fire({title: "Ok", icon:"success"})
        }else{
            Swal.fire({
                title:"Oops!",
                text: i18n.t("mistakes"),
                icon: "question"
            });
            throw error;
        }
    }


  const paperStyle = {
    padding: 20,
    height: "20vh",
    width: "340px",
    margin: "15% auto",
    borderRadius: "20px",
  };

  return (
    <Modal open={open} onClose={handleClose} style={{zIndex: 1}}>
      <Paper elevation={10} style={paperStyle}>
        <Grid align="center" sx={{marginTop: 7}}>
        <TextField 
        label={i18n.t("d-btn-category")}
        onChange={(e) => setCategory(e.target.value)}
        />
        <Button 
        variant="outlined"
        onClick={() => addCategory()}
        >{i18n.t("d-btn-category")}</Button>
        </Grid>
      </Paper>
    </Modal>
  );
}
