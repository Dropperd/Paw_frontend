import React from "react";
import HeaderUI from "../../components/Header";
import { useForm, isEmail, hasLength } from "@mantine/form";
import { Button, Group, TextInput, Box } from "@mantine/core";
import Axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_DOMAIN;

function Register() {

  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },

    validate: {
      name: hasLength({ min: 2, max: 10 }, "Name must be 2-10 characters long"),
      email: isEmail("Invalid email"),
      password: hasLength(
        { min: 8, max: 21 },
        "Password must be 8-21 characters long"
      ),
    },
  });

  async function registerUser(credentials) {
    const url = API_URL + "/user/";
    try {
      const response = await Axios.post(url, JSON.stringify(form.values), {
        headers: { "Content-Type": "application/json" },
      });
      toast.success("Registration successful!" + response, {
        position: toast.POSITION.TOP_RIGHT,
      });
      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }

  return (
    <>
      <HeaderUI pageTitle={"Login"} />
      <ToastContainer />
      <Box
        component="form"
        maw={400}
        mx="auto"
        onSubmit={form.onSubmit(() => {
          registerUser();
        })}
      >
        <TextInput
          label="Name"
          placeholder="Name"
          withAsterisk
          {...form.getInputProps("name")}
        />
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
          mt="md"
          {...form.getInputProps("password")}
        />
        <Group position="right" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </Box>
    </>
  );
}

export default Register;
