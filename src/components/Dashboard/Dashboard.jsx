import { Card } from "../Card";
import React, { Fragment, useEffect, useState, useCallback } from "react";
import { Navbar } from "../Navbar";
import {
  Grid,
  Paper,
  Divider,
  Box,
  MenuItem,
  InputLabel,
  Select,
  FormControl,
  Button,
} from "@mui/material";
import { ModalCategory } from "../ModalCategory";
import { supabase } from "../../config/supabaseClient";
import { i18n } from "../../ES-EN";
import Swal from "sweetalert2";

export default function Dashboard({ session }) {
  const [card, setCard] = useState([]);
  const [category, setCategory] = useState([]);
  const [cat, setCat] = useState("");
  const [catOpen, setCatOpen] = useState(false);

  const handleCatOpen = () => setCatOpen(true);
  const handleCatClose = () => setCatOpen(false);

  const paperStyle = {
    padding: 20,
    height: "auto",
    width: "65%",
    margin: "auto auto",
    borderRadius: "20px",
  };

  const GetCards = async () => {
    const user = supabase.auth.user();
    const { data, error } = await supabase
      .from("cards")
      .select("id, title, content, due, created_at, category, audio")
      .eq("userid", user.id);

    if (data) {
      setCard(data);
    } else {
      throw error;
    }
  };

  const GetCatCards = async (cat) => {
    const user = supabase.auth.user();
    const { data, error } = await supabase
    .from("cards")
    .select("id, title, content, due, created_at, category, audio")
    .match({userid: user.id, category: cat})
    
    if(data){
      setCard(data);    
    }else{
      Swal.fire({title:"Error", icon:"warning"})
      throw error;
    }

  };

  const GetCategory = useCallback( async () => {
    let user = supabase.auth.user()
    const { data, error } = await supabase.from("categories")
    .select("*")
    .match({userid: user.id});

    if (data) {
      setCategory(data);
      //console.log(category);
    } else {
      throw error;
    }
  }, []);


  useEffect(()=>{
    if(cat !== "" && cat !== "All"){
      GetCatCards(cat)
    }else{
      GetCards();
    }
  }, [cat])


  useEffect(() =>{
    GetCategory();
  }, [GetCategory])

  return (
    <Fragment>
      <Paper elevation={10} style={paperStyle}>
        <Navbar session={session} />

        <Button variant="outlined" onClick={handleCatOpen}>
          {i18n.t("d-btn-category")}
        </Button>

        <Box sx={{ minWidth: 120, marginTop: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              {i18n.t("d-select-category")}
            </InputLabel>
            <Select
              defaultValue="All"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={cat}
              label="Category"
              onChange={(e) =>{
                setCat(e.target.value);
                //GetCatCards();
              }}
            >
              <MenuItem value="All">{i18n.t("all")}</MenuItem>
              {category &&
                category.map((ct, index) => (
                  <MenuItem key={index} value={ct.category}>
                    {ct.category}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Box>

        <Divider style={{ marginTop: 10 }} />
        <Grid
          item
          container
          columnSpacing={{ xs: 6, md: 8 }}
          spacing={{ xs: 2, md: 5 }}
          columns={{ xs: 1, sm: 3, md: 3 }}
          padding={2}
        >
          {card &&
            card.map((cd, index) => (
              <Card
                key={index}
                id={cd.id}
                title={cd.title}
                content={cd.content}
                due={cd.due}
                createdAt={cd.created_at}
                category={cd.category ?? "Not Categorized Yet"}
                audio={cd.audio}
              />
            ))}
        </Grid>
      </Paper>
      <ModalCategory open={catOpen} handleClose={handleCatClose} />
    </Fragment>
  );
}
