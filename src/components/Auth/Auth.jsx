import { useState, Fragment } from "react";
import { supabase } from "../../config/supabaseClient";
import { i18n } from "../../ES-EN";
import {
  Button,
  ButtonGroup,
  TextField,
  Typography,
  Grid,
  Paper,
  Box,
  CircularProgress,
} from "@mui/material";
import Swal from "sweetalert2";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const paperStyle = {
    padding: 30,
    height: "auto",
    width: 320,
    margin: "10px auto",
    borderRadius: "20px",
  };

  /*useEffect(()=>{
    if(!cookie.get("ln")){
      cookie.remove("ln");
      cookie.set("ln", "es")
    }
  }, [cookie])*/

  const handleLogin = async (email) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signIn({ email });
      if (error) throw error;
      Swal.fire({title: i18n.t("login-alert-title"), text:i18n.t("login-alert-text"), icon: "success"});
    } catch (error) {
      Swal.fire({title:error.error_description, text:error.message});
    } finally {
      setLoading(false);
    }
  };

  const changeLanguage = () => {
    if (window.localStorage.getItem("i18nextLng") === "es-ES") {
      window.localStorage.setItem("i18nextLng", "en-EN");
      Swal.fire(i18n.t("refresh"));
    } else {
      window.localStorage.setItem("i18nextLng", "es-ES");
      Swal.fire(i18n.t("refresh"));
    }
  };

  return (
    <Fragment>
      <Grid>
        <Paper elevation={10} style={paperStyle}>
          <Grid align="center">
            <img
              style={{ height: 100 }}
              src="https://upload.wikimedia.org/wikipedia/commons/c/cf/Notas.png"
              alt="Notemefy"
            ></img>
            <Typography variant="h5"> Notemefy</Typography>
            <h2>{i18n.t("login")}</h2>
            <label>{i18n.t("login-desc")}</label>

            <form>
              <TextField
                style={{ marginTop: 25, width: 290 }}
                className="textField"
                type="email"
                id="filled-basic"
                label="Email"
                variant="filled"
                onChange={(e) => setEmail(e.target.value)}
              />

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
                    handleLogin(email);
                  }}
                  style={{ marginTop: 35, height: 70 }}
                  variant="contained"
                >
                  {i18n.t("login-magic-link")}
                </Button>
              )}

              
            </form>

            <div style={{ marginTop: 30, color: "gray" }}>
              <Typography variant="body2">
                {i18n.t("login-info")}
              </Typography>
            </div>
            <ButtonGroup
                style={{ marginTop: 20 }}
                color="primary"
                variant="outlined"
                aria-label="outlined button group"
              >
            <Button variant="contained" onClick={() => changeLanguage()}>
                  ES | EN
                </Button>
              </ButtonGroup>
          </Grid>
        </Paper>
      </Grid>
    </Fragment>
  );
}
