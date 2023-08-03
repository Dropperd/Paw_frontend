import React, { useEffect, useState } from "react";
import HeaderUI from "../../components/Header";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Image, Text, Group, Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_DOMAIN;

const ShareImage = () => {
  const [clinicalData, setClinicalData] = useState([]);
  const selectedClinical = { clinical_id: "" };
  const [sharedClinical, setSharedClinical] = useState([]);
  const navigate = useNavigate();

  const { id } = useParams();

  async function getSharedClinicals() {
    const token = sessionStorage.getItem("token");
    const url = `${API_URL}/user/clinicals`;
    try {
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      setSharedClinical(response.data.clinical);
    } catch (error) {
      console.log(error);
    }
  }

  async function getAllClinical() {
    const token = sessionStorage.getItem("token");
    const url = API_URL + "/clinical/";
    try {
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      setClinicalData(response.data.clinical);
    } catch (error) {
      console.log(error);
    }
  }

  async function NewClinicalImage(clinical) {
    selectedClinical.clinical_id = clinical.id;
    const token = sessionStorage.getItem("token");
    const url = API_URL + "/user/clinicals";
    try {
      const response = await axios.post(url, JSON.stringify(selectedClinical), {
        headers: { "Content-Type": "application/json", Authorization: token },
      });
      navigate("/my-images");
    } catch (error) {
      console.log(error);
    }
  }

  async function getUserData() {
    const token = sessionStorage.getItem("token");
    const url = API_URL + "/user/token";
    try {
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  }


  useEffect(() => {
    getUserData();
    getAllClinical();
    getSharedClinicals();
  }, []);

  return (
    <>
      <HeaderUI pageTitle="ShareImage" />
      <Container size="xs" px="xs">

        <Group spacing={7} mt={5}>
          <Text fz="md">Clinical Data:</Text>
          {sharedClinical && (
            <>
            {sharedClinical.map((clinical, index) => (
            <Text key={`sharedClinical-${index}`} fz="md">
              {clinical.name}
            </Text>
          ))}
            </>
            
            )}
        </Group>

        <Group spacing={7} mt={5}>
          <Text fz="md">All Clinical Data:</Text>

          {clinicalData && (
  <>
    {clinicalData
      .filter((clinical) => {
        if (sharedClinical !== null) {
          return !sharedClinical.some((shared) => shared.id === clinical.id);
        } else {
          return true;
        }
      })
      .map((clinical, index) => (
        <Button
          key={`clinicalData-${index}`}
          variant="outline"
          color="blue"
          fullWidth
          onClick={() => {
            NewClinicalImage(clinical);
          }}
        >
          {clinical.name}
        </Button>
      ))}
  </>
)}
        </Group>
      </Container>
    </>
  );
};

export default ShareImage;
