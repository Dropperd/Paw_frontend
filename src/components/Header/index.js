import React, { useState, useEffect } from "react";
import axios from "axios";
import { StyledHeader as Header, StyledLink } from "./styles";
import { StyledContainer as Container } from "./styles";
import { StyledGroup as Group } from "./styles";
import { Title } from "@mantine/core";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_DOMAIN;

const HeaderUI = ({ pageTitle }) => {
  const token = sessionStorage.getItem("token");
  const isLoggedIn = token !== null;
  const [userType, setUserType] = useState(0);
  const navigate = useNavigate();

  async function getUserType() {
    if (token !== null) {
      const url = API_URL + "/user/token";

      try {
        const response = await axios.get(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
        setUserType(response.data.user.user_type);
      } catch (error) {}
    }
  }

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  useEffect(() => {
    getUserType();
  }, []);

  const links = [
    {
      link: "/",
      label: "Home",
    },
    ...(isLoggedIn
      ? [
          ...(userType !== 1
            ? [
                {
                  link: "/my-images",
                  label: "My Images",
                },
                {
                  link: "/upload-images",
                  label: "Upload Images",
                },
              ]
            : []),
          ...(userType === 1
            ? [
                {
                  link: "/clinical-feed",
                  label: "Clinical Feed",
                },
              ]
            : []),
          {
            label: "Logout",
            onClick: handleLogout,
          },
        ]
      : [
          {
            link: "/login",
            label: "Login",
          },
          {
            link: "/register",
            label: "Register",
          },
        ]),
  ];

  return (
    <Header>
      <Container>
        <Title order={1}>{pageTitle}</Title>
        <Group>
          {links.map((item) => (
            <StyledLink
              key={item.label}
              onClick={item.onClick ? item.onClick : () => navigate(item.link)}
            >
              {item.label}
            </StyledLink>
          ))}
        </Group>
      </Container>
    </Header>
  );
};

export default HeaderUI;
