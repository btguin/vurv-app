// import * as React from "react";
import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import theme from "../src/theme";
// import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import { getSupabase } from "../utils/supabase";
import { useEffect } from "react";
import { Configuration, OpenAIApi } from "openai";
import fetch from "isomorphic-unfetch";
import { Auth0Client } from "@auth0/auth0-spa-js";
import { FormControlUnstyledContext } from "@mui/base";
// import { ChatGPTAPIBrowser } from "chatgpt";
import axios from "axios";

// const configuration = new Configuration({
//     organization: "org-scajRwEd9QcqjN9BrvZ2Mvv1",
//     apiKey: 'process.env.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'
// });

// const openai = new OpenAIApi(configuration);
// const response = await openai.listEngines();

// function Index({ chatGPTData, errorMessage }) {
function Index() {
  const { user, error, isLoading } = useUser();
  const [prompt, setPrompt] = useState("");
  const [numWords, setNumWords] = useState("");
  const [response, setResponse] = useState("");
  const [creationsRemaining, setCreationsRemaining] = useState(1);
  const [totalCreations, setTotalCreations] = useState(1);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  async function getCredentials() {
    var axios = require("axios").default;

    var options = {
      method: "POST",
      url: "https://dev-f3qddlxasfyqhf1a.us.auth0.com/oauth/token",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      data: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: "GC9OzD8NyowVA9a4FoqwQmZy9V4eXpHH",
        client_secret: `${process.env.NEXT_PUBLIC_AUTH_CLIENT_SECRET}`,
        audience: "https://dev-f3qddlxasfyqhf1a.us.auth0.com/api/v2/",
      }),
    };

    return axios
      .request(options)
      .then(function (response) {
        return response.data.access_token;
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  async function updateCredits() {
    const accessToken = await getCredentials();
    console.log(accessToken);
    console.log(user.sub);

    var axios = require("axios").default;
    var options = {
      method: "PATCH",
      url: `https://dev-f3qddlxasfyqhf1a.us.auth0.com/api/v2/users/${user.sub}`,
      headers: {
        authorization: `Bearer ${accessToken}`,
        "content-type": "application/json",
      },
      data: {
        user_metadata: {
          creationsRemaining: 100,
          totalCreations: 100
        },
      },
    };

    setCreationsRemaining(100);
    setTotalCreations(100);

    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  async function generateCompletions(thePrompt, numTokens) {
    const response = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "text-davinci-003",
        prompt: thePrompt,
        temperature: 0,
        max_tokens: parseInt(numTokens, 10),
      }),
    });
    const data = await response.json();
    console.log(data.choices[0].text);
    setResponse(data.choices[0].text);
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="secondary">
        <Toolbar>
          <img src="/unboundedLogo.svg" alt="A description of the image" />
          <Box sx={{ flexGrow: 1 }}></Box>
          {user && <Typography>{user.email}</Typography>}
          <Button
            variant="contained"
            color="primary"
            sx={{ m: 1 }}
            onClick={() => {
              updateCredits();
            }}
          >
            UPDATE CREDITS
          </Button>
          {user && (
            <Button
              variant="contained"
              color="primary"
              href="https://buy.stripe.com/eVa01K0hta4SdAk7ss"
              sx={{ m: 1 }}
            >
              UPGRADE
            </Button>
          )}
          {user && (
            <Button
              variant="contained"
              color="primary"
              href="/api/auth/logout"
              sx={{ m: 1 }}
            >
              LOG OUT
            </Button>
          )}
          <Box>
            {!user && (
              <Button
                variant="text"
                color="primary"
                href="/api/auth/login"
                sx={{ m: 1 }}
              >
                LOG IN
              </Button>
            )}
            {!user && (
              <Button
                variant="contained"
                color="primary"
                href="/api/auth/login"
                sx={{ m: 1 }}
              >
                GET STARTED
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 3 }}>
        {!user && (
          <Typography
            variant="h5"
            gutterBottom
            // sx={{ mb: 2, fontFamily: theme.typography.fontFamilyUnbounded }}
            sx={{ mb: 2 }}
          >
            Welcome to Vurvo. We use artificial intelligence to create stories.
            Create an account to begin. Your first story is free, after that it
            costs $3 per month for up to 100 essays. An example prompt and story
            is shown below.
          </Typography>
        )}
        {user && (
          <Typography
            variant="h5"
            gutterBottom
            // sx={{ mb: 2, fontFamily: theme.typography.fontFamilyUnbounded }}
            sx={{ mb: 2 }}
          >
            You have {creationsRemaining}/{totalCreations} stories remaining. Upgrade your account for $3 per
            month for up to 100 stories.
          </Typography>
        )}
        <Typography
          variant="h6"
          //   fontWeight="bold"
          gutterBottom
          //   sx={{ fontFamily: theme.typography.fontFamilyUnbounded }}
        >
          Story Inputs
        </Typography>
        <Box sx={{ p: 1 }}>
          {!user && (
            <TextField
              required
              id="outlined-required"
              label="Prompt"
              defaultValue="Discuss the ways in which the Second Great Awakening and the Transcendentalist movement of the early 19th century influenced the development of American society and culture"
              fullWidth
              disabled
              multiline
              rows={2}
              onChange={(event) => {
                setPrompt(event.target.value);
                console.log(prompt);
              }}
            />
          )}
          {user && (
            <TextField
              required
              id="outlined-required"
              label="Prompt"
              fullWidth
              multiline
              rows={2}
              onChange={(event) => {
                setPrompt(event.target.value);
                console.log(prompt);
              }}
            />
          )}
        </Box>
        <Box sx={{ p: 1 }}>
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid item xs={3}>
              {!user && (
                <TextField
                  required
                  helperText="Max 1,000"
                  id="outlined-required"
                  label="Number of Words"
                  disabled
                  defaultValue="1000"
                  onChange={(event) => {
                    setNumWords(event.target.value);
                    console.log(numWords);
                  }}
                />
              )}
              {user && (
                <TextField
                  required
                  helperText="Max 1,000"
                  id="outlined-required"
                  label="Number of Words"
                  onChange={(event) => {
                    setNumWords(event.target.value);
                    console.log(numWords);
                  }}
                />
              )}
            </Grid>
            <Grid item xs={9}>
              {/* <TextField
                required
                id="outlined-required"
                label="Style"
                defaultValue="1000"
              /> */}
            </Grid>
          </Grid>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2, mb: 1 }}
            onClick={() => {
              //   generateCompletions(prompt, numWords);
              generateCompletions(prompt);
            }}
          >
            CREATE STORY
          </Button>
        </Box>
        <Typography
          variant="h6"
          //   fontWeight="bold"
          gutterBottom
          //   sx={{ fontFamily: theme.typography.fontFamilyUnbounded }}
        >
          Story
        </Typography>
        <Box sx={{ p: 2 }}>
          {!user && (
            <TextField
              id="outlined-disabled"
              multiline
              rows={14}
              fullWidth
              disabled
              defaultValue="The Second Great Awakening and the Transcendentalist movement were two significant movements that emerged in the early 19th century and had a profound impact on the development of American society and culture.
            The Second Great Awakening was a religious revival movement that spread across the United States in the early 19th century. It was characterized by emotional and enthusiastic preaching, large revivals, and a focus on personal conversion and moral reform. The movement was led by a number of influential preachers, including Charles Grandison Finney and Lyman Beecher, who preached a message of salvation and redemption and called on people to turn away from sin and embrace a more virtuous lifestyle.
            The Second Great Awakening had a number of important consequences for American society. It helped to shape American Protestantism and contributed to the growth of various Protestant denominations, including the Methodists and Baptists. It also encouraged people to work towards social reform, as many participants in the movement believed that they had a moral obligation to improve the world around them. This led to the emergence of various reform movements, including the temperance movement, the abolition movement, and the women's rights movement.
            The Transcendentalist movement, on the other hand, was a philosophical and literary movement that emerged in the mid-19th century. Transcendentalists believed in the inherent goodness of people and the power of individual intuition and reason. They rejected traditional institutions and instead emphasized the importance of nature and the individual experience. The movement was led by a number of influential figures, including Ralph Waldo Emerson and Henry David Thoreau, who wrote about the importance of self-reliance, individualism, and the value of nature."
            />
          )}
          {user && (
            <TextField
              id="outlined-disabled"
              label="Essay will populate here, no input required"
              value={response}
              multiline
              rows={14}
              fullWidth
              disabled
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}

// export async function getServerSideProps(context) {
//     try {
//       // Call ChatGPTAPIBrowser and retrieve data
//       const api = new ChatGPTAPIBrowser({
//         email: process.env.NEXT_PUBLIC_OPENAI_EMAIL,
//         password: process.env.NEXT_PUBLIC_OPENAI_PASSWORD,
//       });
//       await api.initSession();
//       const result = await api.sendMessage("Hello World!");

//       return {
//         props: {
//           chatGPTData: result.response,
//         },
//       };
//     } catch (error) {
//       // Handle error and return a proper response to the client
//       console.log(error);
//       return {
//         props: {
//           errorMessage: error.message,
//         },
//       };
//     }
//   }

export default Index;
