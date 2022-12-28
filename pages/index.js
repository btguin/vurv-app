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

// const configuration = new Configuration({
//     organization: "org-scajRwEd9QcqjN9BrvZ2Mvv1",
//     apiKey: 'process.env.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'
// });

// const openai = new OpenAIApi(configuration);
// const response = await openai.listEngines();

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
      max_tokens: numTokens,
    }),
  });
  const data = await response.json();
  console.log(data);
}

export default function Index() {
  const { user, error, isLoading } = useUser();
  const [prompt, setPrompt] = useState(1000);
  const [numWords, setNumWords] = useState(1000);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  //   const [todos, setTodos] = useState([]);

  //     const supabase = getSupabase(user.accessToken);

  //     useEffect(() => {
  //       const fetchTodos = async () => {
  //         const { data } = await supabase.from("todo").select("*");
  //         setTodos(data);
  //       };

  //       fetchTodos();
  //     }, []);
  //   }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* {user && <p>{user.email}</p>}
      {todos?.length > 0 ? (
        todos.map((todo) => <p key={todo.id}>{todo.title}</p>)
      ) : (
        <p>You don't have any todos</p>
      )} */}
      <AppBar position="static" color="secondary">
        <Toolbar>
          <img src="/unboundedLogo.svg" alt="A description of the image" />
          <Box sx={{ flexGrow: 1 }}></Box>
          {user && <Typography>{user.email}</Typography>}
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
        <Typography
          variant="h5"
          gutterBottom
          sx={{ mb: 2, fontFamily: theme.typography.fontFamilyUnbounded }}
        >
          Welcome to Vurvo. We use artificial intelligence to write essays.
          Create an account to begin. Your first essay is free, after that it
          costs $3 per month for up to 100 essays. An example prompt and essay
          is shown below.
        </Typography>
        <Typography
          variant="h6"
          //   fontWeight="bold"
          gutterBottom
          sx={{ fontFamily: theme.typography.fontFamilyUnbounded }}
        >
          Essay Inputs
        </Typography>
        <Box sx={{ p: 1 }}>
          <TextField
            required
            id="outlined-required"
            label="Prompt"
            // defaultValue="Discuss the ways in which the Second Great Awakening and the Transcendentalist movement of the early 19th century influenced the development of American society and culture"
            fullWidth
            multiline
            rows={2}
            onChange={(event) => {
              setPrompt(event.target.value);
              console.log(prompt);
            }}
          />
        </Box>
        <Box sx={{ p: 1 }}>
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid item xs={3}>
              <TextField
                required
                id="outlined-required"
                label="Number of Words (Max 1,000)"
                // defaultValue="1000"
                onChange={(event) => {
              setNumWords(event.target.value);
              console.log(numWords);
            }}
              />
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
              generateCompletions(prompt, numWords);
            }}
          >
            CREATE ESSAY
          </Button>
        </Box>
        <Typography
          variant="h6"
          //   fontWeight="bold"
          gutterBottom
          sx={{ fontFamily: theme.typography.fontFamilyUnbounded }}
        >
          Essay
        </Typography>
        <Box sx={{ p: 2 }}>
          <TextField
            id="outlined-required"
            label="Essay"
            defaultValue="The Second Great Awakening and the Transcendentalist movement were two significant movements that emerged in the early 19th century and had a profound impact on the development of American society and culture.

The Second Great Awakening was a religious revival movement that spread across the United States in the early 19th century. It was characterized by emotional and enthusiastic preaching, large revivals, and a focus on personal conversion and moral reform. The movement was led by a number of influential preachers, including Charles Grandison Finney and Lyman Beecher, who preached a message of salvation and redemption and called on people to turn away from sin and embrace a more virtuous lifestyle.
The Second Great Awakening had a number of important consequences for American society. It helped to shape American Protestantism and contributed to the growth of various Protestant denominations, including the Methodists and Baptists. It also encouraged people to work towards social reform, as many participants in the movement believed that they had a moral obligation to improve the world around them. This led to the emergence of various reform movements, including the temperance movement, the abolition movement, and the women's rights movement.

The Transcendentalist movement, on the other hand, was a philosophical and literary movement that emerged in the mid-19th century. Transcendentalists believed in the inherent goodness of people and the power of individual intuition and reason. They rejected traditional institutions and instead emphasized the importance of nature and the individual experience. The movement was led by a number of influential figures, including Ralph Waldo Emerson and Henry David Thoreau, who wrote about the importance of self-reliance, individualism, and the value of nature."
            fullWidth
            multiline
            rows={14}
          />
        </Box>
      </Box>
    </Box>
  );
}

// export const getServerSideProps = withAuthRequired();
