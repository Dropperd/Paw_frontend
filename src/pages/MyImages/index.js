import React, { useEffect, useState } from "react";
import HeaderUI from "../../components/Header";
import Axios from "axios";
import { SimpleGrid, Text, Button, Select, Space  } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import ImageCard from "../../components/ImageCard";
import moment from "moment";
import { useNavigate } from "react-router-dom";


const API_URL = process.env.REACT_APP_API_DOMAIN;

const MyImages = () => {
  const [images, setImages] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [bodyPos, setBodyPos] = useState([]);
  const [selectedBodyPos, setSelectedBodyPos] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getUserImages();
    getBodyPos();
  }, []);

  async function getUserImagesFilter() {
    const token = sessionStorage.getItem("token");
    const url = API_URL + "/image/";
    const params = {};

    if (startDate !== "") {
      const formattedStartDate = moment(startDate).format("YYYY-MM-DD");
      params.start_date = formattedStartDate;
    }

    if (endDate !== "") {
      const formattedEndDate = moment(endDate).format("YYYY-MM-DD");
      params.end_date = formattedEndDate;
    }

    if (selectedBodyPos !== "") {
      params.body_pos = selectedBodyPos;
    }

    try {
      const response = await Axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        params: params,
      });
      setImages(response.data.images);
    } catch (error) {
      setImages([]);
      console.log(error);
    }
  }

  async function getUserImages() {
    const token = sessionStorage.getItem("token");
    const url = API_URL + "/image/";
    const params = {};

    try {
      const response = await Axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        params: params,
      });
      setImages(response.data.images);
    } catch (error) {
      setImages([]);
      console.log(error);
    }
  }

  function handleShare() {
    navigate("/share");
  }

  async function getBodyPos() {
    var token = sessionStorage.getItem("token");
    var url = API_URL + "/bodyposition/";
    //use axios to get data from api with token

    try {
      const response = await Axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      setBodyPos(response.data.bodyPos);
    } catch (error) {
      console.log(error);
    }
  }



  const handleBodyPosChange = (value) => {
    //find the body position object from the array
    const bodyPosObj = bodyPos.find((pos) => pos.id === value);
    setSelectedBodyPos(bodyPosObj.membro);
  };

  function updateImages() {
    getUserImages();
  }

  function handleFilter() {
    getUserImagesFilter();
  }

  
  return (
    <>
      <HeaderUI pageTitle={"My Images"} />
      <div>
        <div>
        <Text size="lg">Filter by Date</Text>
          <DateInput allowDeselect
            placeholder="Start Date"
            value={startDate}
            onChange={setStartDate}
          />
          <DateInput allowDeselect
            placeholder="End Date"
            value={endDate}
            onChange={setEndDate}
          />
          {bodyPos && (
            <Select
              data={bodyPos.map((pos) => ({
                value: pos.id,
                label: pos.membro,
                key: pos.id, // Add unique key prop
              }))}
              label="Body Position"
              placeholder="Select Body Position"
              required
              style={{ width: "100%" }}
              onChange={handleBodyPosChange}
            />
          )}
          <Space h="md" />
          <Button onClick={handleFilter}>Filter</Button>
            <Button
              radius="md"
              color="yellow"
              style={{ flex: 1 }}
              onClick={handleShare}
            >
              Share Image
            </Button>
            <Space h="md" />
        </div>
        {images.length === 0 ? (
          <>
            <Text size="lg">You have no images uploaded yet.</Text>
          </>
        ) : (
          <>
            <SimpleGrid cols={5}>
              {images.map((image) => (
                <ImageCard key={image.id} image={image} updateImages={updateImages}/>
              ))}
            </SimpleGrid>           
          </>
        )}
      </div>
    </>
  );
};

export default MyImages;
