import React, { useState, useEffect } from "react";
import HeaderUI from "../../components/Header";
import Axios from "axios";
import { SimpleGrid, Text, Button, Select, Space} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import ImageCard from "../../components/ImageCard";
import moment from "moment";

const API_URL = process.env.REACT_APP_API_DOMAIN;

const ClinicalFeed = () => {
  const [userType, setUserType] = useState(0);
  const [images, setClinicalImages] = useState([]);
  const [bodyPos, setBodyPos] = useState([]);
  const [selectedBodyPos, setSelectedBodyPos] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [usersId, setUsersId] = useState([]);
  const [userfilter , setUserFilter] = useState("");


  async function getUserType() {
    const token = sessionStorage.getItem("token");
    const url = API_URL + "/user/token";

    try {
      const response = await Axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      setUserType(response.data.user.user_type);
    } catch (error) {
      console.log(error);
    }
  }

  async function getUserData() {
    const token = sessionStorage.getItem("token");
    const url = API_URL + "/user/token";
    try {
      const response = await Axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      getUserFilter(response.data.user.id);
    } catch (error) {
      console.log(error);
    }
  }

  async function getUserFilter(clinicalid) {
    const token = sessionStorage.getItem("token");
    const url = API_URL + "/image/" + clinicalid + "/filter";
    try {
      const response = await Axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      console.log(response.data.users);
      setUsersId(response.data.users);
    } catch (error) {
      console.log(error);
    }
  }
  

  async function getClinicalImages() {
    const token = sessionStorage.getItem("token");
    const url = API_URL + "/clinical/user";
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

    if (usersId.length > 0) {
      params.user_id = userfilter;
    }

    try {
      const response = await Axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        params: params,
      });
      setClinicalImages(response.data.images);
    } catch (error) {
      setClinicalImages([]);
      console.log(error);
    }
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

  function handleFilter() {
    getClinicalImages();
  }

  useEffect(() => {
    getUserType();
    getBodyPos();
    getClinicalImages();
    getUserData();
  }, []);

  return (
    <>
      <HeaderUI pageTitle={"Clinical Feedback"} />
      <div>
        {usersId && (
          <>
          <Text size="lg">Filter by User</Text>
          <Select allowDeselect
            data={usersId.map((user) => ({
              value: user.user_id,
              label: user.user_id,
              key: user.user_id, // Add unique key prop
          }))}
          label="User"
          placeholder="Select User"
          style={{ width: "100%" }}
          onChange={setUserFilter}
        />
          </>
        )}
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
        <Space h="md" />
        {images.length === 0 ? (
          <>
            <Text size="lg">You have no images uploaded yet.</Text>
          </>
        ) : (
          <>
          <SimpleGrid cols={5}>
            {images && (
              <>
                {images.map((image) => (
                  <ImageCard key={image.id} image={image} />
                ))}
              </>
            )}
          </SimpleGrid>

          </>
        )}


      </div>
    </>
  );
};

export default ClinicalFeed;
