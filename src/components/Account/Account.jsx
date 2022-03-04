import { useState, useEffect } from "react";
import { supabase } from "../../config/supabaseClient";
import Avatar from "../Avatar";
import { i18n }from "../../ES-EN"
import { TextField, Box, CircularProgress, Button, Grid, Divider } from "@mui/material";

export default function Account({ session }) {
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState(null);
    const [website, setWebsite] = useState(null);
    const [avatar_url, setAvatarUrl] = useState(null);

    useEffect(() => {
        getProfile();
    }, [session]);

    async function getProfile() {
        try {
            setLoading(true);
            const user = supabase.auth.user();

            let { data, error, status } = await supabase
                .from("profiles")
                .select(`username, website, avatar_url`)
                .eq("id", user.id)
                .single();

            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                setUsername(data.username);
                setWebsite(data.website);
                setAvatarUrl(data.avatar_url);
            }
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    }

    async function updateProfile({ username, website, avatar_url }) {
        try {
            setLoading(true);
            const user = supabase.auth.user();

            const updates = {
                id: user.id,
                username,
                website,
                avatar_url,
                updated_at: new Date(),
            };

            let { error } = await supabase.from("profiles").upsert(updates, {
                returning: "minimal", // Don't return the value after inserting
            });

            if (error) {
                throw error;
            }
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Grid align="center">
            <div style={{position: "relative", top: 20}}>
            <Avatar
                url={avatar_url}
                sizeW={300}
                sizeH={180}
                onUpload={(url) => {
                    setAvatarUrl(url);
                    updateProfile({ username, website, avatar_url: url });
                }}
            />
            </div>
            <Divider style={{position: "relative", bottom: 60}} />
            <div style={{marginTop: 10}}>
                <TextField
                    id="email"
                    type="text"
                    value={session.user.email}
                    disabled
                />
            </div>
            <div>
                <TextField
                    id="username"
                    type="text"
                    value={username || ""}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div>
                <TextField
                    id="website"
                    type="website"
                    value={website || ""}
                    onChange={(e) => setWebsite(e.target.value)}
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
                    updateProfile({ username, website, avatar_url })
                  }}
                  style={{ marginTop: 35, height: 70 }}
                  variant="contained"
                >
                  {i18n.t("nc-save")}
                </Button>
              )}
            </div>
        </Grid>
    );
}
