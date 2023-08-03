import styled from '@emotion/styled';
import { Header, Container, Group, Burger } from "@mantine/core";


export const StyledHeader = styled(Header)`
  margin: 0;
  padding: 0;
  width: 100%;
`;

export const StyledContainer = styled(Container)`
  display: flex;
  align-items: center;
  max-width: 100%;
`;

export const StyledH1 = styled.h1`
  font-size: 2rem;
  margin: 0;
`;

export const StyledGroup = styled(Group)`
  margin-left: auto;
`;

export const StyledLink = styled.a`
  display: inline-block;
  margin: 0 1rem; 
  color: #fff;
  text-decoration: none;
`;

export const StyledBurger = styled(Burger)`
  margin-left: 1rem;
`;

