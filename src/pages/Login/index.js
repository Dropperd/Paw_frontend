import React, { useState } from "react";
import HeaderUI from "../../components/Header";
import { useForm, isEmail, hasLength } from "@mantine/form";
import { Button, Group, TextInput, Box } from "@mantine/core";
import Axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Navigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_DOMAIN;

function Login() {
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: isEmail("Invalid email"),
      password: hasLength(
        { min: 3, max: 21 },
        "Password must be 8-21 characters long"
      ),
    },
  });

  const [login, setLogin] = useState(false);

  async function loginUser() {
    const url = API_URL + "/auth/login";
    try {
      const response = await Axios.post(url, JSON.stringify(form.values), {
        headers: { "Content-Type": "application/json" },
      });

      setLogin(true);

      sessionStorage.setItem("userID", response.data.userID);
      sessionStorage.setItem("token", response.data.token);
    } catch (error) {
      sessionStorage.removeItem("userID");
      sessionStorage.removeItem("token");

      setLogin(false);

      console.log(error);
      toast.error(error.response.data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }

  return (
    <>
      <HeaderUI pageTitle={"Login"} />
      {login ? (
        <>
          <Navigate to="/" replace={true} />
        </>
      ) : (
        <Box
          component="form"
          maw={400}
          mx="auto"
          onSubmit={form.onSubmit(() => {
            loginUser();
          })}
        >
          <ToastContainer />
          <TextInput
            label="Your email"
            placeholder="Your email"
            withAsterisk
            mt="md"
            {...form.getInputProps("email")}
          />
          <TextInput
            label="Your password"
            placeholder="Your password"
            withAsterisk
            type="password"
            mt="md"
            {...form.getInputProps("password")}
          />
          <Group position="right" mt="md">
            <Button type="submit">Submit</Button>
          </Group>
        </Box>
      )}
    </>
  );
}

export default Login;
