import { useAuth } from "../utils/auth/AuthContext";
import { auth } from "../utils/firebase/db";

import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardHeader,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import { useState, Fragment } from "react";
import { useRouter } from "next/router";
//import { getServerSideProps } from "./finances/expenses/[slug]";

export async function getServerSideProps(context) {
  const referer = context.req.headers.referer;
  return { props: { referer: referer || null } };
}

export default function LoginPage(props) {
  const router = useRouter();

  const referer =
    new URL(props.referer).pathname === router.pathname
      ? null
      : new URL(props.referer).pathname;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formValue, setFormValue] = useState({ email: "", password: "" });

  const { login, logout } = useAuth();

  function formValueHandler(e) {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);
      await login(auth, formValue.email, formValue.password);
      setLoading(false);

      router.push(referer || "/");
    } catch (err) {
      setError(err);
      setLoading(false);
      console.log(err);
    }
  }

  if (auth.currentUser) {
    return (
      <Container>
        <Card>
          <Box>
            <Typography variant="body1">
              User ID: {auth.currentUser.uid}
            </Typography>
          </Box>
          <Box>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={() => logout(auth)}
            >
              Logout
            </Button>
          </Box>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      {/*<p>{JSON.stringify(formValue)}</p>*/}
      {error && <p>{JSON.stringify(error)}</p>}
      <Card>
        {!loading ? (
          <Fragment>
            <form onSubmit={handleSubmit}>
              <Box>
                <TextField
                  name="email"
                  id="email"
                  type="email"
                  label="Email"
                  onChange={(e) => formValueHandler(e)}
                />
              </Box>
              <Box>
                <TextField
                  name="password"
                  id="password"
                  type="password"
                  label="Password"
                  onChange={(e) => formValueHandler(e)}
                />
              </Box>
              <Box>
                <Button type="submit" variant="contained" color="primary">
                  Sign In
                </Button>
              </Box>
            </form>
          </Fragment>
        ) : (
          <CircularProgress />
        )}
      </Card>
    </Container>
  );
}
